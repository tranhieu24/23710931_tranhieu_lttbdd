import { ColorKey, Phone } from "../types";

export const PHONE_COLORS: Record<
  ColorKey,
  { label: string; hex: string; image: number }
> = {
  silver: { label: "bạc", hex: "#C9EEFA", image: require("../../assets/phones/silver.png") },
  red: { label: "đỏ", hex: "#E53A2F", image: require("../../assets/phones/red.png") },
  black: { label: "đen", hex: "#000000", image: require("../../assets/phones/black.png") },
  blue: { label: "xanh", hex: "#2A4494", image: require("../../assets/phones/blue.png") },
};

export const COLOR_ORDER: ColorKey[] = ["silver", "red", "black", "blue"]; // thứ tự 4 ô màu

export const PHONES: Phone[] = [
  {
    id: "1",
    name: "Điện Thoại Vsmart Joy 3 - Hàng chính hãng",
    price: 1790000,
    oldPrice: 1790000,
    rating: 5,
    reviewCount: 828,
    supplier: "Tiki Trading",
    badge: "Ở ĐÂU RẺ HƠN HOÀN TIỀN",
    colors: COLOR_ORDER,
    defaultColor: "blue",
  },
  {
    id: "2",
    name: "Điện Thoại Vsmart Live 4 - Hàng chính hãng",
    price: 3990000,
    oldPrice: 4490000,
    rating: 4,
    reviewCount: 356,
    supplier: "Vsmart Store",
    badge: "GIẢM THÊM 500K",
    colors: COLOR_ORDER,
    defaultColor: "black",
  },
  {
    id: "3",
    name: "Điện Thoại Vsmart Star 5 - Hàng chính hãng",
    price: 2490000,
    oldPrice: 2990000,
    rating: 4,
    reviewCount: 512,
    supplier: "Tiki Trading",
    badge: "FREESHIP TOÀN QUỐC",
    colors: ["silver", "black", "blue"],
    defaultColor: "silver",
  },
  {
    id: "4",
    name: "Điện Thoại Vsmart Active 3 - Hàng chính hãng",
    price: 5490000,
    oldPrice: 6290000,
    rating: 5,
    reviewCount: 203,
    supplier: "Vsmart Store",
    badge: "TRẢ GÓP 0%",
    colors: COLOR_ORDER,
    defaultColor: "red",
  },
  {
    id: "5",
    name: "Điện Thoại Vsmart Aris Pro - Hàng chính hãng",
    price: 7990000,
    oldPrice: 8990000,
    rating: 5,
    reviewCount: 148,
    supplier: "Tiki Trading",
    badge: "QUÀ TẶNG KÈM THEO",
    colors: ["black", "blue", "silver"],
    defaultColor: "black",
  },
  {
    id: "6",
    name: "Điện Thoại Vsmart Bee 3 - Hàng chính hãng",
    price: 1490000,
    oldPrice: 1690000,
    rating: 3,
    reviewCount: 97,
    supplier: "Vsmart Store",
    badge: "GIÁ SỐC CUỐI TUẦN",
    colors: COLOR_ORDER,
    defaultColor: "silver",
  },
];
