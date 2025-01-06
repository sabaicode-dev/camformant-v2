import React from "react";

const FontIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
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
      <rect width="20" height="20" fill="url(#pattern0_1_33)" />
      {/* fill={color} */}
      <defs>
        <pattern
          id="pattern0_1_33"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_33" transform="scale(0.0104167)" />
        </pattern>
        <image
          id="image0_1_33"
          width="96"
          height="96"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADEElEQVR4nO3cP2gUQRTH8a+JGAUlglZGxEJEExAsNaitGm39Q6zERu0sBC9WVhoQiTYasLHSNAqKSKzSqAkKUbQ4sQokEcuIaDRmZWCrI/jmktmbvZvfB65M3tzv3d7tvRsGREREREREREREirUK2AWcBe4Dr4Bp4C+QNdmjqbjQbwJTJQguS6kBe4BnwGIJAstSasA64A6wUIKgstQasAOYLEFAWYoN2A3MlCCcLMUGuPC/lSCYLMUGrAc+lSCULNUGPKhz8VPAbeAk0A1sqKPWPeN/j5OYg3UEPwb0Ae3LrNUGzBo1KiTEBfLOI/ivwJn8m/BK7Peo5a6oZBz2COQj0BWo3g2jVpXEPDICcXdF2wLWqxr1XIOSsRH4ZQRyLmC9bo+rzb1FJeOoEcbMCj5sl1Ix6s3mn0nJuGYEMhS43rhRz92eJuWFEciJgLW6PCaq7opMygcjEDeaCOWCUWsO6CAx00YomwLWGjVqPSRBP41Q1gSq0wnMG7VOB6olS+g3wv+d3xJLQUaMBribASlIR/4B+78GnFf6xekzwne3plvVgOIMGw14o/CL0+Yx+7+iBhSn1wg/9Jc9qTFohP+59g8krKrRgOsKvDg9Hm8/+9SA4gx4/Mac1Oy/0SaMBtyNvcBmlDX4ITXUgMjUgMjUgMjUgMjUgMjUgMjUgJIb1uw/njbN/uPq1ew/rkHN/uOqavYfT49m/3ENaPYf14Rm//F0eez7PxJxfS3vohH+d2Bt7EW2slGjAUnu+2+UTu37j6vfePVr33/BRowGaN9/gTq07z+uY8arfzHg+RKyhCea/cezE/hjNED7/gv03AjfnaK7vcgFpOySx+TzaexFtqpTnge5Ho+90FbTnh8143N88WttOw/rEPDWc0vKArA3cP2kuLMhtgAHgKvLOL74VuwnkPJGq7GAh3skI1T4X4DNsZ9MMwoR/nsdNRCvAS/z3wSkwQ34AVwGViv5lak3ePc94LHGDOH4Bj+XHynpNmBJQLVBz+cH+U3m85xKvulWt5ciIiIiIiIiIkLK/gGIzR1Y5E3pkwAAAABJRU5ErkJggg=="
        />
      </defs>
    </svg>
  );
};

export default FontIcon;
