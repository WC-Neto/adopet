import { ImageSourcePropType } from "react-native";

// Para adicionar uma foto: salve em assets/images e registre aqui com a mesma
// chave usada no campo "foto" do pet (ex.: joe, jana).
export const FOTOS: Record<string, ImageSourcePropType> = {
  luna: require("../../../assets/images/luna.png"),
  rai: require("../../../assets/images/rai.png"),
  sam: require("../../../assets/images/sam.png"),
  jana: require("../../../assets/images/jana.jpg"),
  joe: require("../../../assets/images/joe.jpg"),
  felix: require("../../../assets/images/felix.jpg"),
  bela: require("../../../assets/images/bela.jpg"),
};
