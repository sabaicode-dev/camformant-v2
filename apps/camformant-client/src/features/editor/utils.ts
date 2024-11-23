import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import {
  CustomCvDataParams,
  ProfileDetailParams,
} from "@/utils/types/user-profile";
import { fabric } from "fabric";
import type { RGBColor } from "react-color";
import { uuid } from "uuidv4";
import { CvContentParams, JSON_KEYS } from "./types";
import { SetStateAction } from "react";

export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && item.type === "textbox";
    }
  });
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");

  anchorElement.href = file;
  anchorElement.download = `${uuid()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-text" || type === "textbox";
}

export function rgbaObjectToString(rgba: RGBColor | "transparent") {
  if (rgba === "transparent") {
    return `rgba(33,44,55,1)`;
  }
  const alpha = rgba.a === undefined ? 1 : rgba.a;
  return `rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})`;
}

export const createFilter = (value: string) => {
  let effect;
  switch (value) {
    case "polaroid":
      //@ts-ignore
      effect = new fabric.Image.filters.Polaroid();
      break;
    case "sepia":
      effect = new fabric.Image.filters.Sepia();
      break;
    // case "kodachrome":
    //   //@ts-ignore
    //   effect = new fabric.Image.filters.KodaChrome();
    //   break;
    case "contrast":
      effect = new fabric.Image.filters.Contrast({ contrast: 0.3 });
      break;
    case "brightness":
      effect = new fabric.Image.filters.Brightness({ brightness: 0.8 });
      break;
    case "brownie":
      //@ts-ignore
      effect = new fabric.Image.filters.Brownie();
      break;
    case "vintage":
      //@ts-ignore
      effect = new fabric.Image.filters.Vintage();
      break;
    case "technicolor":
      //@ts-ignore
      effect = new fabric.Image.filters.Technicolor();
      break;
    case "pixelate":
      effect = new fabric.Image.filters.Pixelate();
      break;
    case "invert":
      effect = new fabric.Image.filters.Invert();
      break;
    case "blur":
      effect = new fabric.Image.filters.Blur();
      break;
    case "sharpen":
      effect = new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case "emboss":
      effect = new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case "removecolor":
      //@ts-ignore
      effect = new fabric.Image.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case "blacknwhite":
      //@ts-ignore
      effect = new fabric.Image.filters.BlackWhite();
      break;
    case "vibrance":
      //@ts-ignore
      effect = new fabric.Image.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case "blendcolor":
      effect = new fabric.Image.filters.BlendColor({
        color: "#00ff00",
        mode: "multiply",
      });
      break;
    case "huerotate":
      effect = new fabric.Image.filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case "resize":
      effect = new fabric.Image.filters.Resize();
      break;
    case "gamma":
      //@ts-ignore
      effect = new fabric.Image.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    case "saturation":
      effect = new fabric.Image.filters.Saturation({
        saturation: 0.7,
      });
      break;
    default:
      effect = null;
      return;
  }
  return effect;
};

//function for set data from fetching to fabric object
export const setFetchData = (
  canvas: fabric.Canvas | null,
  userData: CustomCvDataParams | {} | undefined
) => {
  console.log("user data in fetchData", userData);
  for (const [key, value] of Object.entries(userData!)) {
    let previousObj: fabric.Textbox | fabric.Group | undefined; //for getting previous object example we have name and age so the next name will have previous obj is age
    if (Array.isArray(value)) {
      const firstElement: string = Object.keys(value[0])[0];
      value.forEach((item, index) => {
        for (const [innerKey, innerValue] of Object.entries(item)) {
          const nameForSearch = `${key} ${innerKey} ${index + 1}`;
          let educationAcademic: string = "";
          const fabricObject = searchObject(canvas, nameForSearch) as
            | fabric.Textbox
            | fabric.Group;
          if (innerKey == "academic") {
            educationAcademic =
              (innerValue as string).trim() + " of " + item.major.trim();
          }
          if (fabricObject) {
            if (innerKey.includes("percent")) {
              //for any object have loadingbar
              const [backgroundBar, loadingBar] = (
                fabricObject as fabric.Group
              ).getObjects();
              loadingBar.set(
                "width",
                Number(backgroundBar.width) * (Number(innerValue) / 100)
              );
              const percentText = searchObject(
                canvas,
                `${nameForSearch} text`
              ) as fabric.Textbox;
              percentText.set({
                text: String(innerValue) + "%",
              });
            } else {
              fabricObject instanceof fabric.Textbox &&
                fabricObject?.set(
                  "text",
                  String(educationAcademic ? educationAcademic : innerValue)
                );
            }
            previousObj = fabricObject;
          } else {
            const previousFabricObj = searchObject(
              canvas,
              `${key} ${innerKey} ${index}`
            ) as fabric.Textbox; //since the index is from 0
            if (!previousFabricObj) continue; //for not generate when data isnt necessary
            const { newObj, previousObject } = buildObject(
              nameForSearch,
              educationAcademic ? educationAcademic : (innerValue as string),
              previousFabricObj,
              previousObj!,
              firstElement
            );
            previousObj = previousObject;
            canvas?.add(newObj);
            if (key == "skill" && innerKey == "percent") {
              const { newObj } = buildObject(
                `${key} ${innerKey} ${index + 1} text`,
                `${innerValue}%`,
                searchObject(
                  canvas,
                  `${key} ${innerKey} ${index} text`
                ) as fabric.Textbox,
                previousObj!,
                firstElement
              );
              canvas?.add(newObj);
            }
          }
        }
      });
    } else {
      const skipKey = ["dob", "martial", "strength"];
      let forNameObj = "";
      for (const [innerKey, innerValue] of Object.entries(value as any)) {
        if (skipKey.includes(innerKey)) continue;
        if (!innerKey) continue;
        const nameForSearch = `${innerKey}`;
        const fabricObject = searchObject(
          canvas,
          nameForSearch
        ) as fabric.Textbox;
        if (
          !fabricObject &&
          (innerKey == "surname" || innerKey == "lastname")
        ) {
          forNameObj += innerValue + " ";
          const nameTextBox = searchObject(canvas, "name") as fabric.Textbox;
          nameTextBox.set("text", forNameObj);
          continue;
        }
        if (fabricObject) {
          previousObj = fabricObject;
          fabricObject?.set("text", String(innerValue));
        }
      }
    }
  }
  setUneditableAbility(canvas!);
};

//build the fabric object that doesnt exist in canvas
export const buildObject = (
  name: string,
  value: string,
  previousSameTypeObj: fabric.Textbox | fabric.Group,
  previousObject?: fabric.Textbox | fabric.Group,
  firstObjKey?: string
): {
  newObj: fabric.Textbox | fabric.Group;
  previousObject: fabric.Textbox | fabric.Group | undefined;
} => {
  const objToClone = previousSameTypeObj || previousObject;
  let newObj: fabric.Textbox | fabric.Group | any;
  if (previousSameTypeObj instanceof fabric.Group) {
    console.log("inside:", previousSameTypeObj.name);
    previousSameTypeObj.clone((clonedGroup: fabric.Group) => {
      newObj = clonedGroup;

      const [backgroundBar, loadingBar] = newObj.getObjects();

      // Modify the loadingBar properties
      loadingBar.set({
        visible: true,
        opacity: 1,
        width: Number(backgroundBar.width) * (Number(value) / 100),
      });

      // Set the position of the cloned group
      newObj.set({
        top: previousObject?.top! + previousObject?.height! / 2,
        left: previousSameTypeObj.left!,
      });
    });
  } else {
    objToClone.clone((clonedTextbox: fabric.Textbox) => {
      newObj = clonedTextbox;
      newObj.set("text", String(value));
      console.log("new obj name:", newObj?.name);
      //if the textBox is percent so we set the left and top diff from other textbox
      if (objToClone?.name?.includes("percent")) {
        console.log("inside percent oh:::::::");
        newObj.set({
          top: previousObject?.top! - previousObject?.height! / 2,
          left: previousSameTypeObj?.left!,
        });
      } else {
        newObj.set(
          "top",
          previousObject?.top! +
            previousObject?.height! +
            (previousSameTypeObj?.name?.includes(firstObjKey!) ? 10 : 0)
        );
      }
      newObj.set("name", name);
    });
  }
  newObj.set("name", name);
  previousObject = newObj!;
  return { newObj, previousObject };
};

const searchObject = (canvas: fabric.Canvas | null, name: string) => {
  return canvas?.getObjects().find((ele) => ele.name == name);
};

//since we have to convert the plural to singular convention, To suit the name in fabric json
export const setStructureUserdata = (userData: ProfileDetailParams) => {
  return {
    userData: {
      experience: userData.experiences,
      expertise: userData.expertise,
      education: userData.educations,
      reference: userData.references,
      basic: userData.basic,
      description: userData.descriptions,
      language: userData.languages,
      skill: userData.skills,
    },
  };
};

//action inside text:editing:exited
export const catchEditedData = (
  e: fabric.IEvent<Event>,
  setDataForUpdate: React.Dispatch<SetStateAction<any>>,
  canvas: fabric.Canvas
) => {
  const activeObject = e.target! as fabric.Textbox;
  const doubleKeyTextbox: {
    key: string | null;
    value: string | null;
    valueForMainKey: string | null;
  } = {
    key: "",
    value: "",
    valueForMainKey: "",
  };
  if (activeObject.name) {
    const splitNameArr = activeObject.name.trim().split(" ");
    const keyword: {
      key: string;
      innerKey: string;
      index: number;
    } = {
      key: splitNameArr[0],
      innerKey: splitNameArr[1],
      index: Number(splitNameArr[2]),
    };
    if (activeObject.name == "name") {
      const nameParts = activeObject?.text?.trim().split(" ");
      const name = {
        surname: nameParts?.[0] || "",
        lastname: nameParts && nameParts[1] ? nameParts.slice(1).join(" ") : "",
      };
      doubleKeyTextbox.key = "lastname";
      doubleKeyTextbox.value = name.lastname;
      doubleKeyTextbox.valueForMainKey = name.surname;
      keyword.key = "surname";
    } else if (activeObject.name.includes("academic")) {
      const match = activeObject?.text?.trim().match(/^(.+?)\s+of\s+(.+)/);
      const educationValue = {
        academic: match ? match[1] : "",
        major: match ? match[2] : "",
      };
      doubleKeyTextbox.key = "major";
      doubleKeyTextbox.value = educationValue.major;
      doubleKeyTextbox.valueForMainKey = educationValue.academic;
    }

    console.log("firstword:", keyword.key, "\nbackword:", keyword.innerKey);

    //pluralize some key cause in backend some need to pluralize
    keyword.key = [
      "expertise",
      "basic",
      "name",
      "email",
      "description",
      "phonenumber",
      "address",
      "career",
      "lastname",
      "surname",
    ].some((word) => keyword.key.includes(word))
      ? keyword.key
      : keyword.key + "s";
    if (activeObject.name == "name") {
    }
    if (activeObject && activeObject.type === "textbox") {
      console.log(
        "Editing exited for:",
        keyword,
        "with text:",
        activeObject.text,
        "in index",
        keyword.index
      );

      setDataForUpdate((previous: any) => {
        if (keyword.index) {
          if (!previous[keyword.key]) previous[keyword.key] = [];
          for (let i = 0; i < keyword.index; i++) {
            if (!previous[keyword.key][i]) {
              previous[keyword.key][i] = {};
            }
          }
          if (
            !previous[keyword.key][keyword.index - 1] ||
            Object.keys(previous[keyword.key][keyword.index - 1]).length === 0
          )
            previous[keyword.key][keyword.index - 1] = {
              index: keyword.index - 1,
            };

          if (doubleKeyTextbox.key) {
            previous[keyword.key][keyword.index - 1][doubleKeyTextbox.key] =
              doubleKeyTextbox.value;
          }
          const valueForTextbox: string | undefined =
            doubleKeyTextbox.valueForMainKey
              ? doubleKeyTextbox.valueForMainKey
              : activeObject.text;
          previous[keyword.key][keyword.index - 1][keyword.innerKey] =
            keyword.innerKey.includes("percent")
              ? parseInt(valueForTextbox ? valueForTextbox : "0", 10)
              : valueForTextbox;
        } else {
          const key =
            activeObject.name == "description" ? "descriptions" : "basic";
          if (!previous[key]) previous[key] = {};
          if (doubleKeyTextbox.key) {
            previous[key][doubleKeyTextbox.key] = doubleKeyTextbox.value;
          }
          previous[key][keyword.key] = doubleKeyTextbox.valueForMainKey
            ? doubleKeyTextbox.valueForMainKey
            : activeObject.text;
        }

        // if (indexForUpdate) {
        //   if (!previous[nameWithoutNumber][indexForUpdate - 1]["index"])
        //     previous[nameWithoutNumber][indexForUpdate - 1]["index"] =
        //       indexForUpdate - 1;
        //   previous[nameWithoutNumber][indexForUpdate - 1][backString] =
        //     activeObject.text;
        // } else {
        //   previous[nameWithoutNumber] = activeObject.text;
        // }
        return previous;
      });
    }
  }
};
export const postCv = async (
  cvStyle: string,
  canvas: fabric.Canvas,
  updateData: any,
  setDataForUpdate: React.Dispatch<SetStateAction<any>>,
  setCvContent: React.Dispatch<SetStateAction<CvContentParams>>
) => {
  try {
    await axiosInstance.put(API_ENDPOINTS.USER_CUSTOM_CV, {
      style: cvStyle,
      json: canvas.toJSON(JSON_KEYS),
    });
    if (Object.keys(updateData).length !== 0) {
      const responseUserDetail = await axiosInstance.put(
        `${API_ENDPOINTS.USER_PROFILE_DETAIL}?query=updateData`,
        { ...updateData }
      );
      console.log("user profile detail response::::", responseUserDetail);
      if (responseUserDetail) {
        setCvContent((prev: CvContentParams) => {
          return {
            ...prev,
            ...setStructureUserdata(responseUserDetail.data.data),
          };
        });
        setDataForUpdate({});
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const setUneditableAbility = (canvas: fabric.Canvas) => {
  canvas.getObjects().forEach((object) => {
    object.set({
      selectable: false,
      hasControls: false,
    });
  });
};
