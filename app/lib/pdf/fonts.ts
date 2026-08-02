import path from "path";
import { Font } from "@react-pdf/renderer";

// Registers the PDF's fonts as a side effect on import.
const FONTS_DIR = path.join(process.cwd(), "app", "lib", "pdf", "fonts");

Font.register({
  family: "Poppins",
  fonts: [
    { src: path.join(FONTS_DIR, "Poppins-Light.ttf"), fontWeight: 300 },
    { src: path.join(FONTS_DIR, "Poppins-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Poppins-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "Poppins-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "Poppins-Bold.ttf"), fontWeight: 700 },
    { src: path.join(FONTS_DIR, "Poppins-ExtraBold.ttf"), fontWeight: 800 },
  ],
});

Font.register({
  family: "Playfair Display",
  fonts: [
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Bold.ttf"), fontWeight: 700 },
    { src: path.join(FONTS_DIR, "PlayfairDisplay-Black.ttf"), fontWeight: 900 },
  ],
});

Font.register({
  family: "Montserrat",
  fonts: [
    { src: path.join(FONTS_DIR, "Montserrat-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS_DIR, "Montserrat-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS_DIR, "Montserrat-SemiBold.ttf"), fontWeight: 600 },
    { src: path.join(FONTS_DIR, "Montserrat-Bold.ttf"), fontWeight: 700 },
  ],
});
