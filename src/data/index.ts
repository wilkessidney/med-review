import type { SubjectsMap } from "../types";
import { biochem } from "./biochem";
import { physiol } from "./physiol";
import { patho } from "./patho";
import { internal } from "./internal";
import { surgery } from "./surgery";
import { license } from "./license";

export const SUBJECTS: SubjectsMap = {
  license,
  biochem,
  physiol,
  patho,
  internal,
  surgery,
};
