const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");
const fs = require("node:fs");

// Chạy logic React Native trong Node; dịch vụ vẫn gọi HTTP thật tới DB thử nghiệm trong RAM.
const ts = require("typescript");
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const compiled = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    module._compile(compiled.outputText, filename);
  };
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const memory = new Map();
const writes = [];
const storage = {
  async getItem(key) {
    await new Promise((resolve) => setTimeout(resolve, 15));
    return memory.get(key) ?? null;
  },
  async setItem(key, value) { writes.push([key, value]); memory.set(key, value); },
  async removeItem(key) { memory.delete(key); },
};
const native = {
  Platform: { OS: "web" },
  StyleSheet: { create: (styles) => styles },
  Alert: { alert() {} },
};
for (const name of ["View", "Text", "TextInput", "Pressable", "ScrollView", "FlatList", "KeyboardAvoidingView", "ActivityIndicator"]) native[name] = name;
const originalLoad = Module._load;
Module._load = function (name, ...rest) {
  if (name === "react-native") return native;
  if (name === "expo-constants") return { __esModule: true, default: { expoConfig: {} } };
  if (name === "@react-native-async-storage/async-storage") return { __esModule: true, default: storage };
  if (name === "react-native-safe-area-context") return { useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
  return originalLoad.call(this, name, ...rest);
};

const React = require("react");
const { create, act } = require("react-test-renderer");
const { Provider } = require("react-redux");
const { configureStore } = require("@reduxjs/toolkit");
const cart = require("../src/store/cartSlice.ts");
const auth = require("../src/store/authSlice.ts");
const wishlist = require("../src/store/wishlistSlice.ts");
const { api } = require("../src/api/client.ts");
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "../db.json"), "utf8"));
const firstBook = seed.books[0];
const item = { bookId: firstBook.id, title: firstBook.title, price: firstBook.price, emoji: firstBook.emoji, color: firstBook.color, stock: 3, quantity: 1 };
const user = { id: 1, name: "Demo", email: "demo@bookstore.vn" };
const makeStore = () => configureStore({ reducer: { cart: cart.default, auth: auth.default, wishlist: wishlist.default } });
let server;
let renderer;

before(async () => {
  const jsonServer = require("json-server");
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false }));
  app.use(jsonServer.bodyParser);
  app.use(jsonServer.router(structuredClone(seed)));
  server = await new Promise((resolve) => {
    const running = app.listen(0, "127.0.0.1", () => resolve(running));
  });
  api.defaults.baseURL = `http://127.0.0.1:${server.address().port}`;
  api.defaults.proxy = false;
});
after(async () => {
  if (renderer) await act(async () => renderer.unmount());
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  Module._load = originalLoad;
});

async function mount(Component, props = {}, store = makeStore()) {
  if (renderer) await act(async () => renderer.unmount());
  await act(async () => { renderer = create(React.createElement(Provider, { store }, React.createElement(Component, props))); });
  return { store, root: () => renderer.root };
}
const text = () => renderer.root.findAllByType("Text").flatMap((node) => node.children.filter((child) => typeof child === "string" || typeof child === "number")).join("\n");
function field(label) { return renderer.root.findAllByType("TextInput").find((node) => node.props.accessibilityLabel === label); }
function button(label) { return renderer.root.findAllByType("Pressable").find((node) => node.props.accessibilityLabel === label); }
async function fill(label, value) { await act(async () => field(label).props.onChangeText(value)); }
async function press(label) { await act(async () => button(label).props.onPress({ stopPropagation() {} })); }
async function waitFor(predicate) {
  for (let count = 0; count < 100; count++) {
    if (predicate()) return;
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
  }
  assert.fail("Không đạt trạng thái mong đợi sau 2 giây");
}
function navigationSpy() {
  const calls = [];
  return { calls, navigate: (...args) => calls.push(["navigate", ...args]), replace: (...args) => calls.push(["replace", ...args]), popTo: (...args) => calls.push(["popTo", ...args]), push: (...args) => calls.push(["push", ...args]) };
}

test("API: đăng nhập, chuẩn hóa email, mật khẩu sai, đăng ký và email trùng", async () => {
  const service = require("../src/services/authService.ts");
  const result = await service.login(" DEMO@BOOKSTORE.VN ", "123456");
  assert.equal(result.user.email, "demo@bookstore.vn");
  assert.ok(result.token);
  assert.equal(result.user.password, undefined);
  await assert.rejects(service.login("demo@bookstore.vn", "wrong123"), /Email hoặc mật khẩu không đúng/);
  const created = await service.register("  Lab Eight  ", " LAB8-TEST@EXAMPLE.COM ", "123456");
  assert.equal(created.user.name, "Lab Eight");
  assert.equal(created.user.email, "lab8-test@example.com");
  await assert.rejects(service.register("Duplicate", "lab8-test@example.com", "123456"), /Email này đã được đăng ký/);
});

test("Đăng nhập: lỗi dưới từng ô, lỗi API, hiện/ẩn mật khẩu và về Home", async () => {
  const { LoginScreen } = require("../src/screens/LoginScreen.tsx");
  const navigation = navigationSpy();
  const { store } = await mount(LoginScreen, { navigation, route: {} });
  await press("Đăng nhập");
  assert.match(text(), /Vui lòng nhập email/);
  assert.match(text(), /Vui lòng nhập mật khẩu/);
  await fill("Email", "abc");
  await fill("Mật khẩu", "123");
  await press("Đăng nhập");
  assert.match(text(), /Email không đúng định dạng/);
  assert.match(text(), /Mật khẩu tối thiểu 6 ký tự/);
  await fill("Email", "demo@bookstore.vn");
  await fill("Mật khẩu", "wrong123");
  await press("Đăng nhập");
  assert.match(text(), /Email hoặc mật khẩu không đúng/);
  assert.equal(field("Mật khẩu").props.secureTextEntry, true);
  await press("Hiện mật khẩu");
  assert.equal(field("Mật khẩu").props.secureTextEntry, false);
  assert.equal(field("Mật khẩu").props.value, "wrong123");
  await press("Ẩn mật khẩu");
  assert.equal(field("Mật khẩu").props.secureTextEntry, true);
  await fill("Mật khẩu", "123456");
  await press("Đăng nhập");
  assert.ok(store.getState().auth.token);
  assert.deepEqual(navigation.calls.at(-1), ["popTo", "Tabs", { screen: "Home" }]);
});

test("Đăng nhập từ giỏ: replace Checkout giữ đúng tổng tiền", async () => {
  const { LoginScreen } = require("../src/screens/LoginScreen.tsx");
  const navigation = navigationSpy();
  await mount(LoginScreen, { navigation, route: { params: { redirectTo: "Checkout", total: 175500 } } });
  await fill("Email", "demo@bookstore.vn");
  await fill("Mật khẩu", "123456");
  await press("Đăng nhập");
  assert.deepEqual(navigation.calls.at(-1), ["replace", "Checkout", { total: 175500 }]);
});

test("Đăng ký: đủ bốn lỗi, xác nhận mật khẩu, email trùng và tự đăng nhập", async () => {
  const { RegisterScreen } = require("../src/screens/RegisterScreen.tsx");
  const navigation = navigationSpy();
  const { store } = await mount(RegisterScreen, { navigation, route: { params: { redirectTo: "Checkout", total: 65000 } } });
  await press("Đăng ký");
  assert.equal(renderer.root.findAllByType("TextInput").length, 4);
  assert.match(text(), /Vui lòng nhập họ tên/);
  assert.match(text(), /Vui lòng nhập mật khẩu nhập lại/);
  await fill("Họ tên", "Sinh viên Lab 8");
  await fill("Email", "demo@bookstore.vn");
  await fill("Mật khẩu", "123456");
  await fill("Nhập lại mật khẩu", "123457");
  await press("Đăng ký");
  assert.match(text(), /Mật khẩu nhập lại không khớp/);
  await fill("Nhập lại mật khẩu", "123456");
  await press("Đăng ký");
  assert.match(text(), /Email này đã được đăng ký/);
  await fill("Email", "register-ui@example.com");
  await press("Đăng ký");
  assert.equal(store.getState().auth.user.name, "Sinh viên Lab 8");
  assert.deepEqual(navigation.calls.at(-1), ["replace", "Checkout", { total: 65000 }]);
});

test("Persistence: chặn ghi trước ready, khôi phục ba store, ghi thay đổi và xóa phiên", async () => {
  const { usePersistence, CART_KEY, WISHLIST_KEY } = require("../src/hooks/usePersistence.ts");
  memory.clear(); writes.length = 0;
  memory.set("@bookstore/auth", JSON.stringify({ user, token: "saved-token" }));
  memory.set(CART_KEY, JSON.stringify([{ ...item, quantity: 2 }]));
  memory.set(WISHLIST_KEY, JSON.stringify([item.bookId]));
  let ready;
  function Probe() { ready = usePersistence(); return null; }
  const { store } = await mount(Probe);
  assert.equal(ready, false);
  assert.equal(writes.length, 0);
  await waitFor(() => ready);
  assert.equal(store.getState().auth.token, "saved-token");
  assert.equal(store.getState().cart.items[0].quantity, 2);
  assert.deepEqual(store.getState().wishlist.ids, [item.bookId]);
  await act(async () => { store.dispatch(cart.setQuantity({ bookId: item.bookId, quantity: 3 })); store.dispatch(wishlist.toggleWishlist(999)); });
  assert.equal(JSON.parse(memory.get(CART_KEY))[0].quantity, 3);
  assert.deepEqual(JSON.parse(memory.get(WISHLIST_KEY)), [item.bookId, 999]);
  await act(async () => { store.dispatch(auth.logout()); store.dispatch(cart.clearCart()); });
  assert.equal(memory.has("@bookstore/auth"), false);
  assert.deepEqual(JSON.parse(memory.get(CART_KEY)), []);
  await mount(Probe);
  await waitFor(() => ready);
  assert.equal(memory.has("@bookstore/auth"), false);
});

test("Storage: dữ liệu JSON hỏng không làm app lỗi", async () => {
  const { loadJSON } = require("../src/storage/storage.ts");
  memory.set("invalid-json", "{broken");
  assert.equal(await loadJSON("invalid-json"), null);
});

test("Giỏ: nút giới hạn tồn kho, debounce chỉ một lần, đồng bộ thay đổi ngoài", async () => {
  const { CartItemRow } = require("../src/components/CartItemRow.tsx");
  const calls = [];
  const onChangeQty = (...args) => calls.push(args);
  const store = makeStore();
  const renderRow = (quantity) => React.createElement(Provider, { store }, React.createElement(CartItemRow, { item: { ...item, quantity }, onChangeQty, onRemove() {} }));
  await mount(CartItemRow, { item, onChangeQty, onRemove() {} }, store);
  assert.equal(button("Giảm").props.disabled, true);
  await act(async () => { button("Tăng").props.onPress(); button("Tăng").props.onPress(); });
  assert.equal(button("Tăng").props.disabled, true);
  assert.equal(calls.length, 0);
  await waitFor(() => calls.length === 1);
  assert.deepEqual(calls, [[item.bookId, 3]]);
  await act(async () => renderer.update(renderRow(3)));
  await press("Giảm");
  await act(async () => renderer.update(renderRow(1)));
  await act(async () => new Promise((resolve) => setTimeout(resolve, 360)));
  assert.equal(button("Giảm").props.disabled, true);
  assert.equal(calls.length, 1, "Giá trị cục bộ cũ không được ghi đè store");
});

test("Reducer giỏ: giới hạn số lượng và không thêm sách hết hàng", () => {
  const store = makeStore();
  store.dispatch(cart.addItem(item));
  store.dispatch(cart.setQuantity({ bookId: item.bookId, quantity: 999 }));
  assert.equal(store.getState().cart.items[0].quantity, 3);
  store.dispatch(cart.setQuantity({ bookId: item.bookId, quantity: 0 }));
  assert.equal(store.getState().cart.items[0].quantity, 1);
  store.dispatch(cart.addItem({ ...item, bookId: 999, stock: 0 }));
  assert.equal(store.getState().cart.items.length, 1);
});

test("Giỏ: mã giảm giá, chặn thanh toán, xác nhận hủy/xóa", async () => {
  const { CartScreen } = require("../src/screens/CartScreen.tsx");
  const store = makeStore();
  store.dispatch(cart.addItem(item));
  const navigation = navigationSpy();
  await mount(CartScreen, { navigation }, store);
  // Nút Áp dụng có role button; chọn bằng nội dung để tránh phụ thuộc style.
  const applyButton = () => renderer.root.findAllByType("Pressable").find((node) => node.findAllByType("Text").some((child) => child.children.includes("Áp dụng")));
  await fill("Mã giảm giá", "bad-code");
  await act(async () => applyButton().props.onPress());
  assert.match(text(), /Mã giảm giá không hợp lệ/);
  await fill("Mã giảm giá", " sale10 ");
  await act(async () => applyButton().props.onPress());
  await press("Thanh toán");
  assert.deepEqual(navigation.calls.at(-1), ["navigate", "Login", { redirectTo: "Checkout", total: item.price - Math.round(item.price * 0.1) }]);
  await act(async () => store.dispatch(auth.setCredentials({ user, token: "test" })));
  await fill("Mã giảm giá", "GIAM50K");
  await act(async () => applyButton().props.onPress());
  await press("Thanh toán");
  assert.deepEqual(navigation.calls.at(-1), ["navigate", "Checkout", { total: Math.max(0, item.price - 50000) }]);
  const list = renderer.root.findByType("FlatList");
  const row = list.props.renderItem({ item });
  let message;
  global.window = { confirm: (value) => { message = value; return false; } };
  await act(async () => row.props.onRemove(item.bookId));
  assert.equal(store.getState().cart.items.length, 1);
  assert.ok(message.includes(item.title));
  global.window.confirm = () => true;
  await act(async () => row.props.onRemove(item.bookId));
  assert.equal(store.getState().cart.items.length, 0);
  delete global.window;
});

test("Checkout: lớp chặn thứ hai không render khi chưa đăng nhập", async () => {
  const { CheckoutScreen } = require("../src/screens/CheckoutScreen.tsx");
  const navigation = navigationSpy();
  const { store } = await mount(CheckoutScreen, { navigation, route: { params: { total: 123000 } } });
  assert.equal(renderer.toJSON(), null);
  assert.deepEqual(navigation.calls[0], ["replace", "Login", { redirectTo: "Checkout", total: 123000 }]);
  await act(async () => store.dispatch(auth.setCredentials({ user, token: "test" })));
  assert.match(text(), /Tổng tiền cần thanh toán/);
});

test("RatingStars: năm sao, làm tròn và chọn điểm", async () => {
  const { RatingStars } = require("../src/components/RatingStars.tsx");
  const { colors } = require("../src/theme/index.ts");
  await mount(RatingStars, { value: 4.5 });
  assert.equal(renderer.root.findAllByType("Text").filter((node) => node.props.style.color === colors.warning).length, 5);
  assert.equal(renderer.root.findAllByType("Pressable").length, 0);
  let selected;
  await mount(RatingStars, { value: 0, onChange: (n) => { selected = n; } });
  await press("4 sao");
  assert.equal(selected, 4);
});

test("Chi tiết: sách liên quan, lỗi đánh giá, POST và cập nhật điểm trung bình ngay", async () => {
  const { BookDetailScreen } = require("../src/screens/BookDetailScreen.tsx");
  const navigation = navigationSpy();
  const store = makeStore();
  await mount(BookDetailScreen, { navigation, route: { params: { bookId: firstBook.id } } }, store);
  await waitFor(() => text().includes("Đăng nhập để viết đánh giá"));
  const list = renderer.root.findByType("FlatList");
  assert.ok(list.props.data.length > 0);
  assert.ok(list.props.data.every((book) => book.id !== firstBook.id && book.categoryId === firstBook.categoryId));
  const relatedCard = list.props.renderItem({ item: list.props.data[0] }).props.children;
  relatedCard.props.onPress(list.props.data[0]);
  assert.deepEqual(navigation.calls.at(-1), ["push", "BookDetail", { bookId: list.props.data[0].id }]);
  await act(async () => store.dispatch(auth.setCredentials({ user, token: "test" })));
  await press("Gửi đánh giá");
  assert.match(text(), /Vui lòng chọn số sao/);
  await press("5 sao");
  await fill("Bình luận", "   ");
  await press("Gửi đánh giá");
  assert.match(text(), /Vui lòng nhập bình luận/);
  const beforeReviews = (await api.get("/reviews", { params: { bookId: firstBook.id } })).data;
  await fill("Bình luận", "  Đánh giá kiểm thử Lab 8  ");
  await press("Gửi đánh giá");
  const afterReviews = (await api.get("/reviews", { params: { bookId: firstBook.id } })).data;
  assert.equal(afterReviews.length, beforeReviews.length + 1);
  const average = afterReviews.reduce((sum, review) => sum + review.rating, 0) / afterReviews.length;
  assert.ok(text().includes(`${average.toFixed(1)} (${afterReviews.length} đánh giá)`));
  assert.match(text(), /Đánh giá kiểm thử Lab 8/);
  assert.equal(field("Bình luận").props.value, "");
  assert.equal(renderer.root.findAllByType(require("../src/components/RatingStars.tsx").RatingStars)[0].props.value, average);
});

test("Yêu thích: hai nút cùng store, lọc API, bỏ tim và empty state", async () => {
  const { HeartButton } = require("../src/components/HeartButton.tsx");
  const { WishlistScreen } = require("../src/screens/WishlistScreen.tsx");
  const { BookGrid } = require("../src/components/BookGrid.tsx");
  const store = makeStore();
  function TwoHearts() { return React.createElement(React.Fragment, null, React.createElement(HeartButton, { bookId: firstBook.id }), React.createElement(HeartButton, { bookId: firstBook.id })); }
  await mount(TwoHearts, {}, store);
  await press("Yêu thích");
  assert.equal(renderer.root.findAllByType("Pressable").filter((node) => node.props.accessibilityLabel === "Bỏ yêu thích").length, 2);
  const navigation = navigationSpy();
  await mount(WishlistScreen, { navigation }, store);
  await waitFor(() => renderer.root.findAllByType(BookGrid).length > 0);
  assert.deepEqual(renderer.root.findByType(BookGrid).props.data.map((book) => book.id), [firstBook.id]);
  await act(async () => store.dispatch(wishlist.toggleWishlist(firstBook.id)));
  const grid = renderer.root.findByType(BookGrid);
  assert.deepEqual(grid.props.data, []);
  assert.equal(grid.props.ListEmptyComponent.props.title, "Chưa có sách yêu thích");
  grid.props.ListEmptyComponent.props.onAction();
  assert.deepEqual(navigation.calls.at(-1), ["popTo", "Tabs", { screen: "Home" }]);
});

test("Yêu thích: lỗi API và Thử lại", async () => {
  const { WishlistScreen } = require("../src/screens/WishlistScreen.tsx");
  const { ErrorView } = require("../src/components/ErrorView.tsx");
  const { BookGrid } = require("../src/components/BookGrid.tsx");
  const originalURL = api.defaults.baseURL;
  api.defaults.baseURL = `${originalURL}/missing-resource`;
  try {
    await mount(WishlistScreen, { navigation: navigationSpy() });
    await waitFor(() => renderer.root.findAllByType(ErrorView).length > 0);
    api.defaults.baseURL = originalURL;
    await act(async () => renderer.root.findByType(ErrorView).props.onRetry());
    assert.equal(renderer.root.findAllByType(BookGrid).length, 1);
  } finally {
    api.defaults.baseURL = originalURL;
  }
});
