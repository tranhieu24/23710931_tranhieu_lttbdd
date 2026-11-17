const { test, before, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

// Chạy logic màn hình React Native trong Node; các service gọi HTTP thật tới DB trong RAM.
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    module._compile(compiled.outputText, filename);
  };
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react");
const { create, act } = require("react-test-renderer");
const memory = new Map();
const alerts = [];
globalThis.window = { alert: (message) => alerts.push(message), confirm: () => true };
const storage = {
  async getItem(key) { return memory.get(key) ?? null; },
  async setItem(key, value) { memory.set(key, value); },
  async removeItem(key) { memory.delete(key); },
};
const native = { Platform: { OS: "web" }, StyleSheet: { create: (s) => s } };
for (const name of ["View", "Text", "TextInput", "Pressable", "ScrollView", "KeyboardAvoidingView", "ActivityIndicator", "RefreshControl"]) native[name] = name;
native.FlatList = function FlatList(props) {
  return React.createElement("FlatList", props,
    props.ListHeaderComponent,
    props.data.length ? props.data.map((item, index) => React.createElement(React.Fragment, { key: props.keyExtractor(item) }, props.renderItem({ item, index }))) : props.ListEmptyComponent,
    props.ListFooterComponent);
};
const originalLoad = Module._load;
Module._load = function (name, ...rest) {
  if (name === "react-native") return native;
  if (name === "expo-constants") return { __esModule: true, default: { expoConfig: {} } };
  if (name === "@react-native-async-storage/async-storage") return { __esModule: true, default: storage };
  if (name === "react-native-safe-area-context") return { useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) };
  return originalLoad.call(this, name, ...rest);
};

const { Provider } = require("react-redux");
const { configureStore } = require("@reduxjs/toolkit");
const cart = require("../src/store/cartSlice.ts");
const auth = require("../src/store/authSlice.ts");
const wishlist = require("../src/store/wishlistSlice.ts");
const { api } = require("../src/api/client.ts");
const { usePersistence, CART_KEY } = require("../src/hooks/usePersistence.ts");
const { CheckoutScreen } = require("../src/screens/CheckoutScreen.tsx");
const { OrdersScreen } = require("../src/screens/OrdersScreen.tsx");
const { EditProfileScreen } = require("../src/screens/EditProfileScreen.tsx");
const { NotificationsScreen } = require("../src/screens/NotificationsScreen.tsx");
const { HomeScreen } = require("../src/screens/HomeScreen.tsx");
const { BookGrid } = require("../src/components/BookGrid.tsx");
const { PaymentOption } = require("../src/components/PaymentOption.tsx");
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, "../db.json"), "utf8"));
const { password: _password, ...user } = seed.users[0];
const firstBook = seed.books[0];
const item = { bookId: firstBook.id, title: firstBook.title, price: firstBook.price, emoji: firstBook.emoji, color: firstBook.color, stock: 10, quantity: 2 };
const failures = new Map();
const requests = [];
let server, db, renderer;

before(async () => {
  const jsonServer = require("json-server");
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false }));
  app.use(jsonServer.bodyParser);
  app.use((req, res, next) => {
    requests.push({ method: req.method, path: req.path, query: { ...req.query }, body: structuredClone(req.body) });
    const rule = failures.get(`${req.method} ${req.path}`);
    const proceed = () => rule?.status ? res.status(rule.status).json({ message: "Lỗi thử nghiệm" }) : next();
    if (rule?.delay) setTimeout(proceed, rule.delay);
    else proceed();
  });
  const router = jsonServer.router(structuredClone(seed));
  db = router.db;
  app.use(router);
  server = await new Promise((resolve) => {
    const running = app.listen(0, "127.0.0.1", () => resolve(running));
  });
  api.defaults.baseURL = `http://127.0.0.1:${server.address().port}`;
  api.defaults.proxy = false;
});
beforeEach(async () => {
  if (renderer) { await act(async () => renderer.unmount()); renderer = null; }
  db.setState(structuredClone(seed));
  failures.clear(); requests.length = 0; alerts.length = 0; memory.clear();
});
after(async () => {
  if (renderer) await act(async () => renderer.unmount());
  await new Promise((resolve) => server.close(resolve));
  Module._load = originalLoad;
});

function makeStore(loggedIn = true) {
  const store = configureStore({ reducer: { cart: cart.default, auth: auth.default, wishlist: wishlist.default } });
  if (loggedIn) store.dispatch(auth.setCredentials({ user, token: "demo-token" }));
  return store;
}
function Persist({ children }) { return usePersistence() ? children : null; }
function navigationSpy() {
  const calls = [];
  return { calls, navigate: (...args) => calls.push(["navigate", ...args]), replace: (...args) => calls.push(["replace", ...args]), popTo: (...args) => calls.push(["popTo", ...args]), goBack: () => calls.push(["goBack"]), setParams() {} };
}
async function mount(Component, { store = makeStore(), params, persist = false } = {}) {
  const navigation = navigationSpy();
  let screen = React.createElement(Component, { navigation, route: { params } });
  if (persist) screen = React.createElement(Persist, {}, screen);
  await act(async () => { renderer = create(React.createElement(Provider, { store }, screen)); });
  return { store, navigation };
}
const root = () => renderer.root;
const content = () => root().findAllByType("Text").flatMap((node) => node.children.filter((c) => typeof c === "string" || typeof c === "number")).join("\n");
const field = (label) => root().findAllByType("TextInput").find((node) => node.props.accessibilityLabel === label);
const button = (label) => root().findAllByType("Pressable").find((node) => node.props.accessibilityLabel === label || node.findAllByType("Text").some((t) => t.children.join("") === label));
async function fill(label, value) { await act(async () => field(label).props.onChangeText(value)); }
async function press(label) { const node = button(label); assert.ok(node, `Không tìm thấy nút ${label}`); assert.ok(!node.props.disabled, `Nút ${label} bị khoá`); await act(async () => node.props.onPress()); }
async function waitFor(predicate) {
  for (let i = 0; i < 150; i++) {
    if (predicate()) return;
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 15)); });
  }
  assert.fail("Không đạt trạng thái mong đợi sau khi tải API");
}
async function waitList() { await waitFor(() => root().findAllByType("FlatList").length > 0); }
const listData = () => root().findByType("FlatList").props.data;

test("Service đơn hàng: POST tạo pending/ISO, GET chỉ lấy user hiện tại và mới nhất trước", async () => {
  const { createOrder, getOrdersByUser } = require("../src/services/orderService.ts");
  const created = await createOrder({ userId: user.id, items: [item], total: 123000, address: { name: "Demo", phone: "0901234567", address: "TP.HCM" }, paymentMethod: "bank" });
  assert.equal(created.status, "pending");
  assert.ok(!Number.isNaN(Date.parse(created.createdAt)));
  const orders = await getOrdersByUser(user.id);
  assert.equal(orders[0].id, created.id);
  assert.ok(orders.every((o) => o.userId === user.id));
  assert.deepEqual(requests.at(-1).query, { userId: String(user.id), _sort: "createdAt", _order: "desc" });
});

test("Service hồ sơ: PATCH chỉ tên/điện thoại, giữ email/mật khẩu ở server, bỏ mật khẩu khỏi kết quả", async () => {
  const { updateProfile } = require("../src/services/userService.ts");
  const updated = await updateProfile(user.id, { name: "Tên mới", phone: "0912345678", email: "khong-doi@example.com" });
  assert.equal(updated.name, "Tên mới"); assert.equal(updated.password, undefined);
  const record = db.get("users").find({ id: user.id }).value();
  assert.equal(record.email, user.email); assert.equal(record.password, seed.users[0].password);
  assert.deepEqual(requests.at(-1).body, { name: "Tên mới", phone: "0912345678" });
});

test("Checkout: điền sẵn hồ sơ, nút khoá khi thiếu địa chỉ/điện thoại sai, chọn bank", async () => {
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  await mount(CheckoutScreen, { store, params: { total: 50000 } });
  assert.equal(field("Họ tên").props.value, user.name);
  assert.equal(button("Xác nhận đặt hàng").props.disabled, true);
  assert.doesNotMatch(content(), /Vui lòng nhập/);
  await fill("Địa chỉ", "123 Nguyễn Trãi");
  await fill("Số điện thoại", "123");
  assert.equal(button("Xác nhận đặt hàng").props.disabled, true);
  await fill("Số điện thoại", "+84901234567");
  assert.equal(button("Xác nhận đặt hàng").props.disabled, false);
  await act(async () => root().findAllByType(PaymentOption)[1].props.onPress());
  assert.equal(root().findAllByType(PaymentOption)[1].props.selected, true);
  assert.equal(root().findAllByType(PaymentOption)[0].props.selected, false);
});

test("Checkout thành công: đúng payload/tổng sau giảm giá, xoá Redux và AsyncStorage, về Home", async () => {
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  const { navigation } = await mount(CheckoutScreen, { store, params: { total: 50000 }, persist: true });
  await fill("Họ tên", "  Người nhận  "); await fill("Số điện thoại", "090 123 4567"); await fill("Địa chỉ", "  123 Nguyễn Trãi  ");
  await press("Xác nhận đặt hàng");
  const order = db.get("orders").value().at(-1);
  assert.equal(order.userId, user.id); assert.equal(order.total, 50000);
  assert.deepEqual(order.items[0], { bookId: item.bookId, title: item.title, price: item.price, quantity: item.quantity });
  assert.deepEqual(order.address, { name: "Người nhận", phone: "0901234567", address: "123 Nguyễn Trãi" });
  assert.deepEqual(store.getState().cart.items, []);
  assert.deepEqual(JSON.parse(memory.get(CART_KEY)), []);
  assert.match(alerts[0], /Đặt hàng thành công/);
  assert.deepEqual(navigation.calls.at(-1), ["popTo", "Tabs", { screen: "Home" }]);
});

test("Checkout lỗi API: giữ giỏ và form, hiện lỗi; thử lại tạo đúng một đơn", async () => {
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  await mount(CheckoutScreen, { store, params: { total: 70000 }, persist: true });
  await fill("Số điện thoại", "0901234567"); await fill("Địa chỉ", "TP.HCM");
  const count = db.get("orders").size().value();
  failures.set("POST /orders", { status: 500 });
  await press("Xác nhận đặt hàng");
  assert.match(content(), /Máy chủ đang gặp sự cố/);
  assert.deepEqual(store.getState().cart.items, [item]);
  assert.deepEqual(JSON.parse(memory.get(CART_KEY)), [item]);
  assert.equal(field("Địa chỉ").props.value, "TP.HCM"); assert.equal(db.get("orders").size().value(), count);
  failures.clear(); await press("Xác nhận đặt hàng");
  assert.equal(db.get("orders").size().value(), count + 1);
});

test("Checkout: giỏ rỗng khoá nút; chưa đăng nhập chuyển sang Login giữ tổng tiền", async () => {
  await mount(CheckoutScreen, { params: { total: 50000 } });
  await fill("Số điện thoại", "0901234567"); await fill("Địa chỉ", "TP.HCM");
  assert.equal(button("Xác nhận đặt hàng").props.disabled, true);
  await act(async () => renderer.unmount()); renderer = null;
  const { navigation } = await mount(CheckoutScreen, { store: makeStore(false), params: { total: 50000 } });
  assert.deepEqual(navigation.calls[0], ["replace", "Login", { redirectTo: "Checkout", total: 50000 }]);
});

test("Checkout mất kết nối thật: giữ giỏ, hiện lỗi mạng và cho phép thử lại", async () => {
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  await mount(CheckoutScreen, { store, params: { total: 70000 } });
  await fill("Số điện thoại", "0901234567"); await fill("Địa chỉ", "TP.HCM");
  const baseURL = api.defaults.baseURL;
  try {
    api.defaults.baseURL = "http://127.0.0.1:0";
    await press("Xác nhận đặt hàng");
    assert.match(content(), /Không kết nối được máy chủ/);
    assert.deepEqual(store.getState().cart.items, [item]);
    assert.equal(button("Xác nhận đặt hàng").props.disabled, false);
  } finally {
    api.defaults.baseURL = baseURL;
  }
  await press("Xác nhận đặt hàng"); assert.deepEqual(store.getState().cart.items, []);
});

test("Checkout đang gửi: hiện loading và khoá nút/ô nhập đến khi API hoàn tất", async () => {
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  await mount(CheckoutScreen, { store, params: { total: 70000 } });
  await fill("Số điện thoại", "0901234567"); await fill("Địa chỉ", "TP.HCM");
  failures.set("POST /orders", { delay: 100 });
  let pending;
  await act(async () => { pending = button("Xác nhận đặt hàng").props.onPress(); });
  assert.equal(button("Xác nhận đặt hàng").props.disabled, true);
  assert.equal(field("Địa chỉ").props.editable, false);
  assert.equal(store.getState().cart.items.length, 1);
  await act(async () => pending);
  assert.deepEqual(store.getState().cart.items, []);
  assert.equal(requests.filter((r) => r.method === "POST" && r.path === "/orders").length, 1);
});

test("Đơn hàng: thứ tự mới nhất, chỉ một thẻ mở, bộ lọc và trạng thái lọc rỗng", async () => {
  await mount(OrdersScreen); await waitList();
  const orders = listData(); assert.ok(orders.length >= 3);
  assert.deepEqual(orders.map((o) => o.createdAt), orders.map((o) => o.createdAt).sort().reverse());
  await press(`Chi tiết đơn #${orders[0].id}`);
  assert.match(content(), /Giao đến/); assert.match(content(), new RegExp(orders[0].address.address));
  await press(`Chi tiết đơn #${orders[1].id}`);
  assert.equal(root().findAllByType("Pressable").filter((n) => n.props.accessibilityState?.expanded).length, 1);
  await press(`Chi tiết đơn #${orders[1].id}`); assert.doesNotMatch(content(), /Giao đến/);
  for (const [label, status] of [["Chờ xác nhận", "pending"], ["Đang giao", "shipping"], ["Hoàn tất", "completed"], ["Đã huỷ", "cancelled"]]) {
    await press(label); assert.ok(listData().every((o) => o.status === status));
  }
  if (listData().length === 0) assert.match(content(), /Không có đơn hàng ở trạng thái này/);
  await press("Tất cả"); assert.equal(listData().length, orders.length);
});

test("Đơn hàng rỗng có nút mua sắm; lỗi tải có nút thử lại", async () => {
  db.set("orders", []).value();
  failures.set("GET /orders", { status: 500 });
  const { navigation } = await mount(OrdersScreen);
  await waitFor(() => content().includes("Máy chủ đang gặp sự cố"));
  failures.clear(); await press("Thử lại"); await waitList();
  assert.match(content(), /Bạn chưa có đơn hàng nào/);
  await press("Mua sắm ngay"); assert.deepEqual(navigation.calls.at(-1), ["popTo", "Tabs", { screen: "Home" }]);
});

test("Mua lại: cộng giỏ, cập nhật giá/tồn kho mới, giới hạn tồn và bỏ sách hết hàng/đã xoá", async () => {
  const order = { ...seed.orders[0], status: "completed", items: [{ bookId: firstBook.id, title: "Giá cũ", price: 1, quantity: 8 }, { bookId: seed.books[1].id, quantity: 1 }, { bookId: 999999, quantity: 1 }] };
  db.set("orders", [order]).value();
  db.get("books").find({ id: firstBook.id }).assign({ price: 222000, stock: 3 }).value();
  db.get("books").find({ id: seed.books[1].id }).assign({ stock: 0 }).value();
  const store = makeStore(); store.dispatch(cart.hydrateCart([{ ...item, stock: 99, price: 1 }]));
  const { navigation } = await mount(OrdersScreen, { store }); await waitList();
  await press(`Chi tiết đơn #${order.id}`); await press("Mua lại");
  const items = store.getState().cart.items;
  assert.equal(items.length, 1); assert.equal(items[0].quantity, 3); assert.equal(items[0].stock, 3); assert.equal(items[0].price, 222000);
  assert.deepEqual(navigation.calls.at(-1), ["popTo", "Tabs", { screen: "Cart" }]);
});

test("Mua lại lỗi mạng: giữ giỏ; tất cả hết hàng thì báo và không điều hướng", async () => {
  const order = { ...seed.orders[0], status: "completed", items: [{ bookId: firstBook.id, quantity: 2 }] };
  db.set("orders", [order]).value();
  const store = makeStore(); store.dispatch(cart.hydrateCart([item]));
  const { navigation } = await mount(OrdersScreen, { store }); await waitList(); await press(`Chi tiết đơn #${order.id}`);
  failures.set("GET /books", { status: 500 }); await press("Mua lại");
  assert.deepEqual(store.getState().cart.items, [item]); assert.match(alerts.at(-1), /Không thể mua lại/);
  failures.clear(); db.get("books").find({ id: firstBook.id }).assign({ stock: 0 }).value();
  await press("Mua lại"); assert.deepEqual(store.getState().cart.items, [item]); assert.equal(navigation.calls.length, 0);
});

test("Hồ sơ: validate, email bị khoá, lưu PATCH cập nhật store và lưu bền, không chứa mật khẩu", async () => {
  const { store, navigation } = await mount(EditProfileScreen, { persist: true });
  assert.equal(field("Email (không thể đổi)").props.editable, false);
  await fill("Họ tên", "  "); await fill("Số điện thoại", "123"); await press("Lưu thay đổi");
  assert.match(content(), /Vui lòng nhập họ tên/); assert.match(content(), /Số điện thoại không hợp lệ/);
  assert.equal(requests.length, 0);
  await fill("Họ tên", "  Tên đã đổi  "); await fill("Số điện thoại", "091 234 5678"); await press("Lưu thay đổi");
  assert.equal(store.getState().auth.user.name, "Tên đã đổi"); assert.equal(store.getState().auth.user.phone, "0912345678");
  assert.equal(store.getState().auth.user.password, undefined);
  assert.ok([...memory.values()].some((v) => v.includes("Tên đã đổi")));
  assert.ok([...memory.values()].every((v) => !v.includes('"password"')));
  assert.deepEqual(navigation.calls.at(-1), ["goBack"]);
});

test("Hồ sơ lỗi API: giữ thông tin cũ ở store và dữ liệu đang sửa để thử lại", async () => {
  const { store } = await mount(EditProfileScreen);
  await fill("Họ tên", "Chưa lưu"); await fill("Số điện thoại", "0901234567");
  failures.set(`PATCH /users/${user.id}`, { status: 500 }); await press("Lưu thay đổi");
  assert.match(content(), /Máy chủ đang gặp sự cố/); assert.deepEqual(store.getState().auth.user, user);
  assert.equal(field("Họ tên").props.value, "Chưa lưu");
  failures.clear(); await press("Lưu thay đổi"); assert.equal(store.getState().auth.user.name, "Chưa lưu");
});

test("Thông báo: lọc user, mới nhất trước, đánh dấu đọc và điều hướng theo target", async () => {
  const notifications = [
    { id: 101, userId: user.id, title: "Đơn hàng", body: "Theo dõi", createdAt: "2026-11-01T00:00:00.000Z", read: false, target: { screen: "Orders" } },
    { id: 102, userId: user.id, title: "Sách", body: "Khám phá", createdAt: "2026-11-02T00:00:00.000Z", read: false, target: { screen: "BookDetail", bookId: firstBook.id } },
    { id: 103, userId: 999, title: "Riêng tư", createdAt: "2026-11-03T00:00:00.000Z", read: false },
  ];
  db.set("notifications", notifications).value();
  const { navigation } = await mount(NotificationsScreen); await waitList();
  assert.deepEqual(listData().map((n) => n.id), [102, 101]);
  const { NotificationItem } = require("../src/components/NotificationItem.tsx");
  await act(async () => root().findAllByType(NotificationItem)[0].props.onPress(listData()[0]));
  assert.equal(listData()[0].read, true);
  assert.deepEqual(navigation.calls.at(-1), ["navigate", "BookDetail", { bookId: firstBook.id }]);
  await waitFor(() => db.get("notifications").find({ id: 102 }).value().read);
  await act(async () => root().findAllByType(NotificationItem)[1].props.onPress(listData()[1]));
  assert.deepEqual(navigation.calls.at(-1), ["navigate", "Orders"]);
  await waitFor(() => db.get("notifications").find({ id: 101 }).value().read);
});

test("Thông báo lỗi PATCH: lạc quan đổi read ngay, sau đó hoàn tác; đã đọc không PATCH lần nữa", async () => {
  db.set("notifications", [{ id: 201, userId: user.id, title: "Thông báo", body: "Nội dung", createdAt: "2026-11-01", read: false }]).value();
  failures.set("PATCH /notifications/201", { status: 500, delay: 80 });
  await mount(NotificationsScreen); await waitList();
  const { NotificationItem } = require("../src/components/NotificationItem.tsx");
  await act(async () => root().findByType(NotificationItem).props.onPress(listData()[0]));
  assert.equal(listData()[0].read, true);
  await waitFor(() => !listData()[0].read);
  assert.equal(db.get("notifications").find({ id: 201 }).value().read, false);
  failures.clear(); await act(async () => root().findByType(NotificationItem).props.onPress(listData()[0]));
  await waitFor(() => db.get("notifications").find({ id: 201 }).value().read);
  const count = requests.filter((r) => r.method === "PATCH").length;
  await act(async () => root().findByType(NotificationItem).props.onPress(listData()[0]));
  assert.equal(requests.filter((r) => r.method === "PATCH").length, count);
});

test("Thông báo rỗng và lỗi tải có thử lại", async () => {
  db.set("notifications", []).value(); failures.set("GET /notifications", { status: 500 });
  await mount(NotificationsScreen); await waitFor(() => content().includes("Máy chủ đang gặp sự cố"));
  failures.clear(); await press("Thử lại"); await waitList(); assert.match(content(), /Chưa có thông báo nào/);
});

test("Home làm mới: giữ danh sách trong lúc tải, cập nhật sách/danh mục, lỗi giữ danh sách cũ", async () => {
  await mount(HomeScreen); await waitList();
  const oldPrice = root().findByType(BookGrid).props.data[0].price;
  db.get("books").find({ id: firstBook.id }).assign({ price: oldPrice + 10000 }).value();
  db.get("categories").first().assign({ name: "Danh mục đã đổi" }).value();
  failures.set("GET /books", { delay: 80 });
  let pending;
  await act(async () => { pending = root().findByType(BookGrid).props.onRefresh(); });
  assert.equal(root().findByType(BookGrid).props.refreshing, true);
  assert.equal(root().findByType(BookGrid).props.data[0].price, oldPrice);
  await act(async () => pending);
  assert.equal(root().findByType(BookGrid).props.refreshing, false);
  assert.equal(root().findByType(BookGrid).props.data[0].price, oldPrice + 10000);
  assert.match(content(), /Danh mục đã đổi/);
  failures.set("GET /books", { status: 500 });
  await act(async () => root().findByType(BookGrid).props.onRefresh());
  assert.equal(root().findByType(BookGrid).props.data[0].price, oldPrice + 10000);
  assert.equal(root().findByType(BookGrid).props.refreshing, false); assert.match(alerts.at(-1), /Không thể làm mới/);
});

test("Lưu bền: khởi động lại nạp giỏ/yêu thích/hồ sơ đã sửa", async () => {
  memory.set(CART_KEY, JSON.stringify([item]));
  memory.set("@bookstore/wishlist", JSON.stringify([firstBook.id]));
  const { saveAuth } = require("../src/storage/authStorage.ts");
  await saveAuth({ user: { ...user, name: "Đã lưu" }, token: "saved-token" });
  const store = makeStore(false);
  await mount(EditProfileScreen, { store, persist: true });
  assert.equal(store.getState().auth.user.name, "Đã lưu");
  assert.deepEqual(store.getState().cart.items, [item]);
  assert.deepEqual(store.getState().wishlist.ids, [firstBook.id]);
});

test("Cấu hình nhận diện đầy đủ và không còn placeholder trong mã nguồn", () => {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../app.json"), "utf8")).expo;
  assert.equal(config.name, "BookStore"); assert.equal(config.splash.backgroundColor, "#0B1F5C");
  for (const asset of [config.icon, config.splash.image, config.android.adaptiveIcon.foregroundImage, config.web.favicon]) assert.ok(fs.existsSync(path.join(__dirname, "..", asset)));
  function inspect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name);
      if (entry.isDirectory()) inspect(filename);
      else if (/\.[tj]sx?$/.test(filename)) assert.doesNotMatch(fs.readFileSync(filename, "utf8"), /TODO BT9|TodoBox|console\.log/);
    }
  }
  inspect(path.join(__dirname, "../src"));
});
