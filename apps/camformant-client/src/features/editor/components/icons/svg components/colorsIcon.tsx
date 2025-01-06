import React from "react";

const ColorsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect width="20" height="20" fill="url(#pattern0_1_170)" />
      <defs>
        <pattern
          id="pattern0_1_170"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_170" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_1_170"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACWElEQVR4nO2cuYoVURRFF4I4ayIqGomIiYL+izjgvxiJBqKJKLbt8CkaiSMIfoGC4JDZdGsrzZaCCgwbff32fu/tBTu/tc4951YVVEEppZRSSimllFJKKaWUUsrk2A9cAR4Br4FvwAYgczbGtbwZ1zas8cA8Ff4U8BhYC5CtTWZY65Nx7TPLLuAW8DtAqP4xw9pvj9cyU5wE3gcI1ITyCjjKjHAO+BogTRPOJ+AsM7Dz51G+/ipCbCfsBN4FSNIW5y2wm0BuBsjRlHKNwNHzK0CMppTVtFH0MECKppwlQtgLrAQIkeFhLeKJ+VKADJlymQCWAkTIlGUCeBkgQsYnZDtfAkTIlOEtqp2fASJkynDrbSfhnb6M2dYC0AK4d6HaAX4R6gjyy5AhPQNoAey7UO0Avwh1BPllyJCeAbQA9l2odoBfhDqC/DJkSM8AWgD7LlQ7wC9CHUF+GTKkZwAtgH0Xqh3gF6GOIL8MGdIzgBbAvgvVDvCLUEeQX4YM6RlAC2DfhWoH+EWoI8gvQ4b0DKAFsO9CtQP8IrSoI+hHgAQt8gca/UTJzIuAnShThg8U7dwPECFTHhDAhQARMuUiAexZ0F8VrAL7CGERv5ZfJogTwHqAFE0p6+M1R3EjQIymlOFa49gOPAuQoy3Oc2AHoRwGPgRI0hb+tO8Y4Zye0yJ8BM4wIxwEngZI0wTHzhFmjGFOXgW+BwjUf9ztXE+e+ZvhEHBnxh7WVsZXLMeZI4Yn5vPA3bGlP4f8UX1tfKM7rOneuMZhraWUUkoppZRSSimllFJKKUyCP0MfFA7h5tBvAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
};

export default ColorsIcon;
