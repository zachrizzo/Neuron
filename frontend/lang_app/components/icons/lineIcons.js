import { View } from "react-native";
import React from "react";
import Svg, { Path, Circle, G, Mask, Rect, Ellipse } from "react-native-svg";
import PropTypes from "prop-types";

/**
 * ArrowLeftAndRight component - A custom icon component that displays an arrow pointing left or right.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} [props.direction="left"] - The direction of the arrow. Can be "left" or "right".
 * @param {string} [props.color="#ffffff"] - The color of the icon.
 * @param {number} [props.width=24] - The width of the icon.
 * @param {number} [props.height=24] - The height of the icon.
 * @param {string} props.testID - The test ID for the ArrowLeftAndRight component.
 *
 */
export function ArrowLeftAndRight({
  direction = "left",
  color = "#ffffff",
  hight = 24,
  width = 24,
  testID,
}) {
  return (
    <View testID={testID}>
      {direction == "left" ? (
        <Svg
          width={width}
          height={hight}
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M1 5L0.646447 4.64645L0.292893 5L0.646447 5.35355L1 5ZM13 5.5C13.2761 5.5 13.5 5.27614 13.5 5C13.5 4.72386 13.2761 4.5 13 4.5V5.5ZM4.64645 0.646447L0.646447 4.64645L1.35355 5.35355L5.35355 1.35355L4.64645 0.646447ZM0.646447 5.35355L4.64645 9.35355L5.35355 8.64645L1.35355 4.64645L0.646447 5.35355ZM1 5.5H13V4.5H1V5.5Z"
            fill={color}
          />
        </Svg>
      ) : (
        <Svg
          width={width}
          height={hight}
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M13 5L13.3536 4.64645L13.7071 5L13.3536 5.35355L13 5ZM1 5.5C0.723858 5.5 0.5 5.27614 0.5 5C0.5 4.72386 0.723858 4.5 1 4.5V5.5ZM9.35355 0.646447L13.3536 4.64645L12.6464 5.35355L8.64645 1.35355L9.35355 0.646447ZM13.3536 5.35355L9.35355 9.35355L8.64645 8.64645L12.6464 4.64645L13.3536 5.35355ZM13 5.5H1V4.5H13V5.5Z"
            fill={color}
          />
        </Svg>
      )}
    </View>
  );
}

ArrowLeftAndRight.propTypes = {
  direction: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  testID: PropTypes.string,
};

/**
 * CheckMark component - A custom icon component that displays a check mark.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} [props.color="#fff"] - The color of the icon.
 * @param {number} [props.width="24"] - The width of the icon.
 * @param {number} [props.height="24"] - The height of the icon.
 * @param {string} props.testID - The test ID for the CheckMark component.
 *
 */
export function CheckMark({ testID, width, height, color }) {
  return (
    <Svg
      testID={testID}
      width={width || "24"}
      height={height || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6"
        stroke={color || "#fff"}
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

CheckMark.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  testID: PropTypes.string,
};

/**
 * ClipBoard component - A custom icon component that displays a clipboard.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} [props.color] - The color of the icon.
 * @param {number} [props.width=24] - The width of the icon.
 * @param {number} [props.height=24] - The height of the icon.
 * @param {string} props.testID - The test ID for the ClipBoard component.
 *
 */
export function ClipBoard({ color, width, height, testID }) {
  return (
    <View testID={testID}>
      <Svg
        width={width ? width : 24}
        height={height ? height : 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M15.5 5C16.9045 5 17.6067 5 18.1111 5.33706C18.3295 5.48298 18.517 5.67048 18.6629 5.88886C19 6.39331 19 7.09554 19 8.5V18C19 19.8856 19 20.8284 18.4142 21.4142C17.8284 22 16.8856 22 15 22H9C7.11438 22 6.17157 22 5.58579 21.4142C5 20.8284 5 19.8856 5 18V8.5C5 7.09554 5 6.39331 5.33706 5.88886C5.48298 5.67048 5.67048 5.48298 5.88886 5.33706C6.39331 5 7.09554 5 8.5 5"
          stroke={color}
          stroke-width="4"
        />
        <Path
          d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
          stroke={color}
          stroke-width="4"
        />
        <Path
          d="M9 12L15 12"
          stroke={color}
          stroke-width="4"
          stroke-linecap="round"
        />
        <Path
          d="M9 16L13 16"
          stroke={color}
          stroke-width="4"
          stroke-linecap="round"
        />
      </Svg>
    </View>
  );
}

ClipBoard.propTypes = {
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  testID: PropTypes.string,
};

/**
 * ExpandArrow component - A custom icon component that displays an expand arrow.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} props.testID - The test ID for the ExpandArrow component.
 *
 */
export function ExpandArrow({ testID }) {
  return (
    <Svg
      testID={testID}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M18 9L12 15L6 9" stroke="#65B0F6" />
    </Svg>
  );
}

ExpandArrow.propTypes = {
  testID: PropTypes.string,
};

/**
 * EyeOpenAndClosed component - A custom icon component that displays an eye that can be open or closed.
 * @component
 * @param {object} props - The props of the component.
 * @param {boolean} [props.hidden=false] - A boolean indicating whether the eye is hidden or not.
 * @param {string} [props.color="#000000"] - The color of the icon.
 * @param {string} [props.height="24"] - The height of the icon.
 * @param {string} [props.width="24"] - The width of the icon.
 * @param {string} props.testID - The test ID for the EyeOpenAndClosed component.
 *
 */
export function EyeOpenAndClosed({
  hidden = false,
  color = "#000000",
  height = "24",
  width = "24",
  testID,
}) {
  if (hidden) {
    return (
      <Svg
        testID={testID}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M12 5C6.55576 5 3.53109 9.23425 2.45554 11.1164C2.23488 11.5025 2.12456 11.6956 2.1367 11.9836C2.14885 12.2716 2.27857 12.4598 2.53799 12.8362C3.8182 14.6935 7.29389 19 12 19C16.7061 19 20.1818 14.6935 21.462 12.8362C21.7214 12.4598 21.8511 12.2716 21.8633 11.9836C21.8754 11.6956 21.7651 11.5025 21.5445 11.1164C20.4689 9.23425 17.4442 5 12 5Z"
          stroke={color}
        />
        <Circle cx="12" cy="12" r="3" stroke={color} />
      </Svg>
    );
  } else {
    return (
      <Svg
        testID={testID}
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M12 5C6.55576 5 3.53109 9.23425 2.45554 11.1164C2.23488 11.5025 2.12456 11.6956 2.1367 11.9836C2.14885 12.2716 2.27857 12.4598 2.53799 12.8362C3.8182 14.6935 7.29389 19 12 19C16.7061 19 20.1818 14.6935 21.462 12.8362C21.7214 12.4598 21.8511 12.2716 21.8633 11.9836C21.8754 11.6956 21.7651 11.5025 21.5445 11.1164C20.4689 9.23425 17.4442 5 12 5Z"
          stroke={color}
        />
        <Circle cx="12" cy="12" r="3" stroke={color} />
        <Path
          d="M5 5L20 19"
          stroke={color}
          stroke-width="0.8"
          stroke-linecap="round"
        />
      </Svg>
    );
  }
}

EyeOpenAndClosed.propTypes = {
  hidden: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  testID: PropTypes.string,
};

/**
 * Home component - A custom home icon component.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} props.testID - The test ID for the Home component.
 * @param {string} props.color - The color of the Home component.
 * @param {number} props.width - The width of the Home component.
 * @param {number} props.height - The height of the Home component.
 *
 */
export function Home({ testID, color, width, height }) {
  return (
    <Svg
      testID={testID}
      width={width ? width : 20}
      height={height ? height : 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.73031 0.788233C9.00031 -0.220767 10.7803 -0.260768 12.0893 0.668233L12.2503 0.788233L18.3393 5.65923C19.0093 6.17823 19.4203 6.94923 19.4903 7.78823L19.5003 7.98923V16.0982C19.5003 18.1882 17.8493 19.8882 15.7803 19.9982H13.7903C12.8393 19.9792 12.0703 19.2392 12.0003 18.3092L11.9903 18.1682V15.3092C11.9903 14.9982 11.7593 14.7392 11.4503 14.6882L11.3603 14.6782H8.68931C8.37031 14.6882 8.11031 14.9182 8.07031 15.2182L8.06031 15.3092V18.1592C8.06031 18.2182 8.0493 18.2882 8.04031 18.3382L8.0303 18.3592L8.01931 18.4282C7.90031 19.2792 7.2003 19.9282 6.33031 19.9892L6.2003 19.9982H4.41031C2.32031 19.9982 0.610305 18.3592 0.500305 16.2982V7.98923C0.509305 7.13823 0.880305 6.34823 1.50031 5.79823L7.73031 0.788233ZM11.3803 1.87823C10.6203 1.26823 9.54031 1.23923 8.74031 1.76823L8.58931 1.87823L2.50931 6.77923C2.16031 7.03823 1.95031 7.42823 1.90031 7.83823L1.88931 7.99823V16.0982C1.88931 17.4282 2.92931 18.5182 4.25031 18.5982H6.2003C6.4203 18.5982 6.61031 18.4492 6.63931 18.2392L6.66031 18.0592L6.67031 18.0082V15.3092C6.67031 14.2392 7.4903 13.3692 8.54031 13.2882H11.3603C12.4293 13.2882 13.2993 14.1092 13.3803 15.1592V18.1682C13.3803 18.3782 13.5303 18.5592 13.7303 18.5982H15.5893C16.9293 18.5982 18.0193 17.5692 18.0993 16.2582L18.1103 16.0982V7.99823C18.0993 7.56923 17.9203 7.16823 17.6103 6.86923L17.4803 6.75823L11.3803 1.87823Z"
        fill={color}
      />
    </Svg>
  );
}

Home.propTypes = {
  testID: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * LogOut component - A custom logout icon component.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} props.testID - The test ID for the LogOut component.
 *
 */
export function LogOut({ testID }) {
  return (
    <Svg
      testID={testID}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.331 2.02148C13.7103 2.02148 15.6522 3.89542 15.7612 6.24772L15.766 6.45648V7.38948C15.766 7.8037 15.4302 8.13948 15.016 8.13948C14.6363 8.13948 14.3225 7.85733 14.2729 7.49125L14.266 7.38948V6.45648C14.266 4.89358 13.044 3.61575 11.5035 3.52647L11.331 3.52148H6.45603C4.89398 3.52148 3.61629 4.74362 3.52702 6.28406L3.52203 6.45648V17.5865C3.52203 19.1493 4.74394 20.4272 6.28369 20.5165L6.45603 20.5215H11.341C12.8984 20.5215 14.1721 19.3039 14.2611 17.7693L14.266 17.5975V16.6545C14.266 16.2403 14.6018 15.9045 15.016 15.9045C15.3957 15.9045 15.7095 16.1866 15.7592 16.5527L15.766 16.6545V17.5975C15.766 19.9687 13.8992 21.9046 11.5554 22.0164L11.341 22.0215H6.45603C4.07759 22.0215 2.13587 20.1474 2.02686 17.7952L2.02203 17.5865V6.45648C2.02203 4.07743 3.89579 2.13535 6.24734 2.02631L6.45603 2.02148H11.331ZM19.3261 8.50234L19.4104 8.57478L22.3384 11.4898C22.3647 11.5159 22.3879 11.5426 22.4091 11.5707L22.3384 11.4898C22.3689 11.5202 22.3963 11.5526 22.4205 11.5865C22.4376 11.6103 22.4534 11.6354 22.4677 11.6614C22.4703 11.6665 22.4729 11.6715 22.4755 11.6764C22.4881 11.7004 22.4994 11.7253 22.5093 11.7508C22.5133 11.762 22.5174 11.7733 22.5211 11.7847C22.5284 11.8058 22.5346 11.8274 22.5397 11.8494C22.5421 11.8612 22.5446 11.8729 22.5467 11.8846C22.5509 11.905 22.5539 11.9261 22.5559 11.9474C22.5571 11.9623 22.5581 11.977 22.5587 11.9917C22.5593 12.0016 22.5595 12.0115 22.5595 12.0214L22.5587 12.0497C22.5581 12.0651 22.5571 12.0805 22.5555 12.0958L22.5595 12.0214C22.5595 12.0682 22.5552 12.1141 22.547 12.1585C22.5446 12.1696 22.5421 12.1814 22.5394 12.193C22.5344 12.2162 22.528 12.2387 22.5206 12.2607C22.5168 12.2709 22.513 12.2813 22.5091 12.2915C22.4998 12.3164 22.489 12.3405 22.4769 12.3639C22.4739 12.3692 22.4708 12.3751 22.4676 12.381C22.4332 12.4443 22.39 12.5015 22.3399 12.5517L22.3385 12.5527L19.4105 15.4687C19.117 15.761 18.6421 15.76 18.3498 15.4665C18.0841 15.1997 18.0607 14.783 18.2792 14.4898L18.352 14.4059L19.991 12.7705L9.76853 12.7714C9.35432 12.7714 9.01853 12.4356 9.01853 12.0214C9.01853 11.6417 9.30069 11.3279 9.66676 11.2782L9.76853 11.2714L19.993 11.2705L18.3521 9.63779C18.0852 9.37212 18.0601 8.95551 18.2773 8.66142L18.3497 8.57714C18.6154 8.31028 19.032 8.28514 19.3261 8.50234Z"
        fill="#FF3737"
      />
    </Svg>
  );
}

LogOut.propTypes = {
  testID: PropTypes.string,
};

/**
 * NotificationBell component - A custom notification bell component.
 * @component
 * @param {object} props - The props of the component.
 * @param {string} props.testID - The test ID for the NotificationBell.
 * @param {string} [props.color] - The color of the bell in Tailwind CSS format.
 * @param {string} [props.width] - The width of the bell in Tailwind CSS format.
 * @param {string} [props.height] - The height of the bell in Tailwind CSS format.
 *
 */

export function NotificationBell({ testID, color, width, height }) {
  return (
    <Svg
      testID={testID}
      width={width ? width : 24}
      height={height ? height : 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14.608 19.6906C14.9045 19.9321 14.9515 20.3713 14.7129 20.6715C14.5366 20.8935 14.3327 21.0922 14.1167 21.255C13.3891 21.826 12.464 22.0849 11.5453 21.9754C10.6258 21.8659 9.787 21.3962 9.21459 20.6689C8.9774 20.3676 9.02646 19.9286 9.32418 19.6885C9.62189 19.4484 10.0555 19.4981 10.2927 19.7995C10.6379 20.2381 11.1467 20.523 11.7064 20.5896C12.2669 20.6564 12.8307 20.4986 13.2826 20.1443C13.4158 20.0437 13.5355 19.927 13.6389 19.7969C13.8775 19.4967 14.3114 19.4491 14.608 19.6906ZM5.15213 8.99974L5.16444 8.40391C5.17324 8.14906 5.18686 7.91248 5.20685 7.68096C5.50654 4.44456 8.59565 2 11.9648 2H12.0361C15.4034 2 18.4934 4.44285 18.8034 7.68536C18.8212 7.89148 18.8288 8.07458 18.8311 8.33206L18.832 9.11982C18.8327 9.19158 18.8339 9.25469 18.8358 9.31353L18.845 9.50977L18.8896 9.69688C19.0303 10.218 19.2776 10.7052 19.6162 11.1282L19.7669 11.3055L19.8286 11.3847C20.2348 11.9917 20.4668 12.698 20.5 13.4587L20.499 13.862C20.4707 14.763 20.1399 15.6331 19.5338 16.3582C18.7311 17.2101 17.6434 17.7393 16.4873 17.8457C13.502 18.1699 10.49 18.1699 7.51296 17.8466C6.34896 17.7346 5.26444 17.2069 4.42663 16.3223C3.80882 15.5691 3.48041 14.6208 3.5009 13.6624L3.50175 13.4242C3.53744 12.6955 3.76804 11.9898 4.16936 11.3802L4.23653 11.2938C4.70525 10.7799 5.02569 10.151 5.16473 9.47306L5.14969 9.53395L5.15213 8.99974ZM12.0361 3.39535H11.9648C9.26651 3.39535 6.80804 5.34087 6.57967 7.80678C6.56798 7.94228 6.55866 8.08207 6.55137 8.2292L6.53532 8.69559L6.52879 9.61486L6.51441 9.75667C6.32444 10.683 5.88728 11.5409 5.24929 12.2404L5.29856 12.1833L5.21045 12.3291C5.04539 12.6265 4.9389 12.9495 4.89682 13.2682L4.87935 13.4587L4.87919 13.6774C4.86568 14.3142 5.08086 14.9356 5.45369 15.3931C6.02881 15.9985 6.80682 16.377 7.65168 16.4583C10.5393 16.7719 13.4527 16.7719 16.3514 16.4572C17.1871 16.3802 17.9645 16.002 18.5084 15.4267C18.92 14.933 19.1375 14.3097 19.1216 13.6536L19.1224 13.4901C19.1013 13.0186 18.951 12.5613 18.6873 12.1672L18.7026 12.1926L18.5647 12.0309C18.0893 11.4441 17.744 10.7635 17.5517 10.034L17.4868 9.75818L17.4739 9.66551C17.4642 9.53013 17.4585 9.40982 17.4555 9.26514L17.4528 8.3605C17.4509 8.13044 17.4447 7.97558 17.4307 7.81326C17.1944 5.34075 14.7336 3.39535 12.0361 3.39535Z"
        fill={color}
      />
    </Svg>
  );
}

NotificationBell.propTypes = {
  testID: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

/**
 * @component
 * Renders a people icon.
 * @param {string} testID - Test ID for the component.
 * @param {string} color - Color of the icon.
 * @param {number} width - Width of the icon.
 * @param {number} height - Height of the icon.
 * @returns {JSX.Element} - React component that displays a people icon.
 */
export function People({ testID, color, width, height }) {
  return (
    <Svg
      testID={testID}
      width={width ? width : 20}
      height={height ? height : 20}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9.59131 14.4563L9.91109 14.4576C14.5555 14.4981 17.1833 15.4361 17.1833 17.9983C17.1833 20.5061 14.6648 21.4736 10.2234 21.5546L9.59131 21.5603C4.74697 21.5603 2.00031 20.6394 2.00031 18.0183C2.00031 15.3937 4.7579 14.4563 9.59131 14.4563ZM9.59131 15.9563C5.57395 15.9563 3.50031 16.6612 3.50031 18.0183C3.50031 19.3667 5.56898 20.0603 9.59131 20.0603C13.6089 20.0603 15.6833 19.3552 15.6833 17.9983C15.6833 16.6505 13.6127 15.9563 9.59131 15.9563ZM17.587 13.7481C18.1676 13.7876 18.7448 13.8708 19.2994 13.9938C20.4875 14.2301 21.3708 14.6713 21.7755 15.5204C22.0743 16.1491 22.0743 16.8806 21.7755 17.5092C21.3731 18.3563 20.499 18.7942 19.3042 19.04C18.8985 19.1234 18.5019 18.8622 18.4185 18.4565C18.335 18.0507 18.5963 17.6542 19.002 17.5707C19.7708 17.4126 20.2826 17.1562 20.4207 16.8654C20.5259 16.6441 20.5259 16.3856 20.4211 16.165C20.282 15.8732 19.7676 15.6163 18.991 15.4616C18.4936 15.3515 17.9908 15.279 17.4852 15.2446C17.072 15.2165 16.7597 14.8587 16.7878 14.4455C16.8159 14.0322 17.1737 13.72 17.587 13.7481ZM9.59131 2.49976C12.4393 2.49976 14.7263 4.78636 14.7263 7.63376C14.7263 10.482 12.4395 12.7688 9.59131 12.7688C6.74323 12.7688 4.45731 10.4821 4.45731 7.63376C4.45731 4.78622 6.74341 2.49976 9.59131 2.49976ZM16.02 3.56936C18.2549 3.56936 20.067 5.38183 20.067 7.61636C20.067 9.85157 18.2552 11.6634 16.02 11.6634C15.6058 11.6634 15.27 11.3276 15.27 10.9134C15.27 10.4991 15.6058 10.1634 16.02 10.1634C17.4268 10.1634 18.567 9.02314 18.567 7.61636C18.567 6.21019 17.4264 5.06936 16.02 5.06936C15.6058 5.06936 15.27 4.73357 15.27 4.31936C15.27 3.90514 15.6058 3.56936 16.02 3.56936ZM9.59131 3.99976C7.57189 3.99976 5.95731 5.6146 5.95731 7.63376C5.95731 9.65379 7.57176 11.2688 9.59131 11.2688C11.6111 11.2688 13.2263 9.65354 13.2263 7.63376C13.2263 5.61484 11.611 3.99976 9.59131 3.99976Z"
        fill={color}
      />
    </Svg>
  );
}

People.propTypes = {
  testID: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * @component
 * Renders a pie chart icon.
 * @param {string} testID - Test ID for the component.
 * @param {string} color - Color of the icon.
 * @param {number} width - Width of the icon.
 * @param {number} height - Height of the icon.
 * @returns {JSX.Element} - React component that displays a pie chart icon.
 */
export function PieChart({ testID, color, width, height }) {
  return (
    <Svg
      testID={testID}
      width={width ? width : 20}
      height={height ? height : 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M8.49776 4.7606C8.58545 4.93485 8.63817 5.12392 8.65332 5.32102L9.04185 10.8095C9.04706 10.8847 9.08269 10.9548 9.14085 11.0042C9.18448 11.0413 9.23808 11.0645 9.29801 11.0712L9.35991 11.0724L14.9341 10.7366C15.3867 10.71 15.8305 10.8675 16.1604 11.1719C16.4902 11.4763 16.6768 11.9004 16.6744 12.3912C16.4265 16.0037 13.773 19.0237 10.159 19.8065C6.54503 20.5893 2.83611 18.9474 1.05781 15.7848C0.582292 14.9695 0.261779 14.0778 0.113798 13.1749L0.0664268 12.8359C0.0253023 12.5821 0.00319023 12.3257 0 12.0795L0.00311369 11.8372C0.0133983 8.06546 2.66156 4.80403 6.38809 3.92434L6.64383 3.86807L6.7814 3.84532C7.502 3.74681 8.21097 4.12453 8.49776 4.7606ZM7.01643 5.27813L6.93217 5.28772L6.70369 5.33933C3.73526 6.05477 1.6062 8.61031 1.48796 11.621L1.4828 11.8661C1.47569 12.0525 1.4825 12.2392 1.50499 12.4378L1.53277 12.6408C1.63212 13.495 1.90795 14.3206 2.34914 15.0772C3.81632 17.6863 6.86669 19.0367 9.839 18.3929C12.8113 17.7491 14.9936 15.2653 15.1958 12.3414C15.1958 12.2974 15.1774 12.2552 15.1446 12.225C15.1228 12.2049 15.0959 12.1912 15.0675 12.1851L15.024 12.1817L9.45904 12.5169C8.98938 12.5503 8.52549 12.3992 8.17003 12.0971C7.81456 11.7951 7.59684 11.3669 7.56522 10.91L7.17702 5.42617C7.17632 5.41708 7.17385 5.40822 7.15682 5.37299C7.1315 5.31695 7.07648 5.28131 7.01643 5.27813ZM11.423 0.00105033C15.7084 0.122269 19.3029 3.20162 19.9904 7.34084L20 7.4567L19.9977 7.65855C19.9737 7.95621 19.8538 8.23931 19.6545 8.46677C19.4041 8.75241 19.0477 8.92862 18.6588 8.95674L12.0133 9.39005C11.1615 9.43818 10.4295 8.80509 10.3741 7.97348L9.92986 1.44914L9.9349 1.30295L9.95698 1.13824C10.0162 0.84619 10.1684 0.579378 10.3925 0.376428C10.6739 0.121564 11.0474 -0.0133911 11.423 0.00105033ZM11.4113 1.44902L11.8511 7.87814C11.8537 7.91719 11.888 7.94688 11.9214 7.94502L18.5182 7.51352L18.4854 7.33352C17.8318 4.0802 15.0119 1.66443 11.6287 1.45932L11.4113 1.44902Z"
        fill={color}
      />
    </Svg>
  );
}

PieChart.propTypes = {
  testID: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

/**
 * @component
 * Renders a search icon.
 * @param {string} testID - Test ID for the component.
 * @param {string} color - Color of the icon.
 * @returns {JSX.Element} - React component that displays a search icon.
 */
export function SearchIcon({ testID, color }) {
  return (
    <Svg
      testID={testID}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.16667 9.16667C4.16667 6.40917 6.40917 4.16667 9.16667 4.16667C11.9242 4.16667 14.1667 6.40917 14.1667 9.16667C14.1667 11.9242 11.9242 14.1667 9.16667 14.1667C6.40917 14.1667 4.16667 11.9242 4.16667 9.16667ZM17.2558 16.0775L14.4267 13.2475C15.3042 12.1192 15.8333 10.705 15.8333 9.16667C15.8333 5.49083 12.8425 2.5 9.16667 2.5C5.49083 2.5 2.5 5.49083 2.5 9.16667C2.5 12.8425 5.49083 15.8333 9.16667 15.8333C10.705 15.8333 12.1192 15.3042 13.2475 14.4267L16.0775 17.2558C16.24 17.4183 16.4533 17.5 16.6667 17.5C16.88 17.5 17.0933 17.4183 17.2558 17.2558C17.5817 16.93 17.5817 16.4033 17.2558 16.0775Z"
        fill="white"
      />
      <Mask
        id="mask0_109_1691"
        style="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="2"
        y="2"
        width="16"
        height="16"
      >
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.16667 9.16667C4.16667 6.40917 6.40917 4.16667 9.16667 4.16667C11.9242 4.16667 14.1667 6.40917 14.1667 9.16667C14.1667 11.9242 11.9242 14.1667 9.16667 14.1667C6.40917 14.1667 4.16667 11.9242 4.16667 9.16667ZM17.2558 16.0775L14.4267 13.2475C15.3042 12.1192 15.8333 10.705 15.8333 9.16667C15.8333 5.49083 12.8425 2.5 9.16667 2.5C5.49083 2.5 2.5 5.49083 2.5 9.16667C2.5 12.8425 5.49083 15.8333 9.16667 15.8333C10.705 15.8333 12.1192 15.3042 13.2475 14.4267L16.0775 17.2558C16.24 17.4183 16.4533 17.5 16.6667 17.5C16.88 17.5 17.0933 17.4183 17.2558 17.2558C17.5817 16.93 17.5817 16.4033 17.2558 16.0775Z"
          fill="white"
        />
      </Mask>
      <G mask="url(#mask0_109_1691)">
        <Rect width="20" height="20" fill={color ? color : "#3B5162"} />
      </G>
    </Svg>
  );
}

SearchIcon.propTypes = {
  testID: PropTypes.string,
  color: PropTypes.string,
};

/**
 * @component
 * Renders a three-bar menu icon.
 * @param {string} testID - Test ID for the component.
 * @returns {JSX.Element} - React component that displays a three-bar menu icon.
 */
export function ThreeMenuBar({ testID }) {
  return (
    <Svg
      testID={testID}
      width="50"
      height="80"
      viewBox="0 12 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9.04169 12.3155H31.9584"
        stroke="#3B5162"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M9.04169 20.5H31.9584"
        stroke="#3B5162"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M9.04169 28.6845H31.9584"
        stroke="#3B5162"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

ThreeMenuBar.propTypes = {
  testID: PropTypes.string,
};

/**
 * @component
 * Renders an X icon.
 * @param {number} width - Width of the icon.
 * @param {number} height - Height of the icon.
 * @param {string} color - Color of the icon.
 * @param {string} testID - Test ID for the component.
 * @returns {JSX.Element} - React component that displays an X icon.
 */
export function XIcon({ width = 24, height = 24, color = "#000", testID }) {
  return (
    <Svg
      testID={testID}
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1 1L13 13"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 1L1 13"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

XIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  testID: PropTypes.string,
};

/**
 * @component
 * Renders a check mark icon.
 * @param {string} testID - test id for the component.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @returns {JSX.Element} - React component that displays a check mark icon.
 */

export function EditWithLine({
  width = 24,
  height = 24,
  color = "#3B5162",
  margin = 0,
  testID,
}) {
  return (
    <Svg
      testID={testID}
      className={`${margin}`}
      width={width}
      height={height}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17.3415 15.7089C17.7052 15.7089 18 15.998 18 16.3545C18 16.6813 17.7523 16.9514 17.4308 16.9941L17.3415 17H10.471C10.1073 17 9.81246 16.711 9.81246 16.3545C9.81246 16.0277 10.0602 15.7576 10.3816 15.7148L10.471 15.7089H17.3415ZM10.6592 0.916618C11.906 -0.305539 13.9283 -0.305539 15.175 0.916618L16.4694 2.1854C17.7162 3.40755 17.7162 5.38985 16.4694 6.612L6.74061 16.1486C6.1843 16.6939 5.43007 16.9999 4.64282 16.9999H0.658541C0.288415 16.9999 -0.00901523 16.701 0.000208899 16.3383L0.100432 12.3975C0.120357 11.6526 0.43127 10.9425 0.968667 10.4157L10.6592 0.916618ZM9.906 3.479L1.89998 11.3287C1.60126 11.6215 1.42814 12.0169 1.41707 12.4305L1.33345 15.7084L4.64282 15.7088C5.03222 15.7088 5.4067 15.5745 5.70228 15.3317L5.8093 15.2357L13.855 7.349L9.906 3.479ZM14.2437 1.82953C13.5113 1.11156 12.323 1.11156 11.5905 1.82953L10.838 2.566L14.786 6.436L15.5381 5.69909C16.2298 5.02101 16.2683 3.94433 15.6534 3.22195L15.5381 3.09831L14.2437 1.82953Z"
        fill={color}
      />
    </Svg>
  );
}

EditWithLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  margin: PropTypes.number,
  testID: PropTypes.string,
};

/**
 * @component
 * Renders a sort icon.
 * @param {string} testID - test id for the component.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @returns {JSX.Element} - React component that displays a sort icon.
 */
export function Sort({ testID, width = 24, height = 24, color = "#3B5162" }) {
  return (
    <Svg
      testID={testID}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M5 7H19" stroke={color} strokeLinecap="round" />
      <Path d="M5 12H15" stroke={color} strokeLinecap="round" />
      <Path d="M5 17H11" stroke={color} strokeLinecap="round" />
    </Svg>
  );
}

Sort.propTypes = {
  testID: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

/**
 * @component
 * Renders a user icon.
 * @param {string} margin - margin of the icon.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @param {string} testID - test id for the component.
 * @returns {JSX.Element} - React component that displays a user icon.
 */
export function UserIcon({
  margin,
  width = 24,
  height = 24,
  color = "#3B5162",
  testID,
}) {
  return (
    <Svg
      testID={testID}
      className={`${margin}`}
      width={width}
      height={height}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M33.9667 17.3332C33.9667 21.733 30.3999 25.2998 26 25.2998C21.6001 25.2998 18.0333 21.733 18.0333 17.3332C18.0333 12.9333 21.6001 9.3665 26 9.3665C30.3999 9.3665 33.9667 12.9333 33.9667 17.3332Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M12.096 32.5336C13.1684 30.3528 15.4981 29.25 17.9283 29.25H34.0717C36.5019 29.25 38.8316 30.3528 39.904 32.5336C40.9474 34.6552 42.0466 37.6824 42.2249 41.2489C42.2525 41.8005 41.8023 42.25 41.25 42.25H10.75C10.1977 42.25 9.7475 41.8005 9.77508 41.2489C9.9534 37.6824 11.0526 34.6552 12.096 32.5336Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

UserIcon.propTypes = {
  margin: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  testID: PropTypes.string,
};

/**
 * @component
 * Renders an add user icon.
 * @param {string} testID - test id for the component.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @returns {JSX.Element} - React component that displays an add user icon.
 */
export function AddUser({
  testID,
  width = 52,
  height = 52,
  color = "#3B5162",
}) {
  return (
    <Svg
      testID={testID}
      width={width}
      height={height}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={2}
    >
      <Ellipse
        cx="26"
        cy="17.3332"
        rx="8.66667"
        ry="8.66667"
        stroke={color}
        strokeLinecap="round"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M36.9393 36.9998C35.9783 36.4354 34.9401 35.9452 33.8398 35.5382C30.691 34.3736 27.1594 33.9374 23.6884 34.2801C20.2177 34.6228 16.9487 35.7305 14.2966 37.4749C11.6444 39.2193 9.7162 41.5312 8.78643 44.1336C8.69353 44.3937 8.82902 44.6798 9.08907 44.7727C9.34911 44.8656 9.63523 44.7301 9.72814 44.4701C10.5729 42.1054 12.3434 39.9565 14.8461 38.3103C17.3489 36.6641 20.4596 35.6038 23.7867 35.2753C27.1134 34.9468 30.4923 35.3663 33.4929 36.4761C33.9293 36.6375 34.3545 36.8123 34.7676 36.9998L36.9393 36.9998ZM41 41.6664C41.1102 41.6689 41.222 41.6352 41.3161 41.5627C41.4919 41.4274 41.5528 41.1982 41.4827 40.9998H41V41.6664Z"
        fill={color}
      />
      <Path d="M39 30.3335L39 47.6668" stroke={color} strokeLinecap="round" />
      <Path d="M47.6667 39L30.3333 39" stroke={color} strokeLinecap="round" />
    </Svg>
  );
}

AddUser.propTypes = {
  testID: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

/**
 * Renders a trash icon.
 * @component
 * @param {object} props - props object.
 * @param {string} testID - test id for the component.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @returns {JSX.Element} - React component that displays a trash icon.
 */
export function Trash({ testID, width = 52, height = 52, color = "#FF0000" }) {
  return (
    <Svg
      testID={testID}
      width={width}
      height={height}
      viewBox="0 0 32 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M24.4422 11.2692L24.5709 11.271C25.0482 11.3103 25.4141 11.7055 25.4395 12.1812L25.4272 12.4464L25.0204 17.4125L24.5937 22.2588C24.5034 23.2263 24.4226 24.0423 24.3529 24.6847C24.1105 26.9233 22.6528 28.3077 20.4555 28.3487C17.0315 28.4117 13.7403 28.4111 10.5442 28.3422C8.41039 28.2975 6.9743 26.8982 6.73616 24.6938L6.57158 23.0696L6.28398 19.9193L5.98936 16.4622L5.6525 12.3125C5.61064 11.78 5.99887 11.3137 6.51965 11.2709C6.99702 11.2317 7.42007 11.5619 7.51951 12.0274L7.55821 12.4077L7.87451 16.298L8.21989 20.3304C8.3748 22.076 8.50916 23.4887 8.61668 24.4811C8.75238 25.7373 9.41589 26.3839 10.5835 26.4083C13.7546 26.4767 17.0213 26.4773 20.4212 26.4147C21.6598 26.3916 22.3338 25.7514 22.4724 24.4715L22.6363 22.8561C22.6843 22.3583 22.7355 21.8087 22.7898 21.2117L23.1355 17.2459L23.5519 12.1572C23.5904 11.6692 23.9769 11.2951 24.4422 11.2692ZM4.85016 9.03889C4.32771 9.03889 3.90417 8.60588 3.90417 8.07175C3.90417 7.58212 4.26006 7.17748 4.7218 7.11344L4.85016 7.10461H8.9714C9.46114 7.10461 9.88989 6.78243 10.0433 6.31824L10.0808 6.1749L10.401 4.54655C10.6831 3.46808 11.5989 2.70024 12.6722 2.61363L12.8752 2.60547H18.2144C19.3054 2.60547 20.2689 3.30988 20.6398 4.39833L20.7023 4.60684L21.0087 6.17451C21.1049 6.66566 21.4979 7.03249 21.9733 7.09512L22.1181 7.10461H26.2396C26.7621 7.10461 27.1856 7.53761 27.1856 8.07175C27.1856 8.56137 26.8297 8.96602 26.368 9.03006L26.2396 9.03889H4.85016ZM18.2144 4.53975H12.8752C12.6098 4.53975 12.3738 4.69857 12.2758 4.89819L12.2426 4.98589L11.936 6.55433C11.8985 6.74576 11.8442 6.93011 11.7747 7.10588L19.3149 7.10613C19.2716 6.99647 19.2341 6.88346 19.203 6.76748L19.1535 6.55394L18.8607 5.04618C18.7923 4.78457 18.581 4.59304 18.326 4.54925L18.2144 4.53975Z"
        fill={color}
      />
    </Svg>
  );
}

Trash.propTypes = {
  testID: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

/**
 * @component
 * @param {object} props - props object.
 * @param {string} testID - test id for the component.
 * @param {string} direction - direction of the arrow, either "up" or "down".
 * @returns {JSX.Element} - React component that displays an arrow pointing up or down.
 */
export function ArrowIndicatorUpAndDown({ testID, direction = "down" }) {
  // arrow pointing up or down
  return (
    <Svg
      testID={testID}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {direction === "down" ? (
        <Path
          d="M4.80794 5.76953L1.09346 1.31215C0.659238 0.791085 1.02976 -4.31825e-07 1.70803 -4.02177e-07L8.29197 -1.14384e-07C8.97024 -8.47357e-08 9.34076 0.791085 8.90654 1.31215L5.19206 5.76953C5.09211 5.88947 4.90789 5.88947 4.80794 5.76953Z"
          fill="#FF0000"
        />
      ) : (
        <Path
          d="M4.80794 0.230469L1.09346 4.68785C0.659238 5.20892 1.02976 6 1.70803 6L8.29197 6C8.97024 6 9.34076 5.20892 8.90654 4.68785L5.19206 0.230469C5.09211 0.110527 4.90789 0.110527 4.80794 0.230469Z"
          fill="#00B11C"
        />
      )}
    </Svg>
  );
}

ArrowIndicatorUpAndDown.propTypes = {
  testID: PropTypes.string,
  direction: PropTypes.oneOf(["up", "down"]),
};

/**
 * @component
 * Renders a simple plus icon.
 * @param {string} testID - test id for the component.
 * @param {number} width - width of the icon.
 * @param {number} height - height of the icon.
 * @param {string} color - color of the icon.
 * @returns {JSX.Element} - React component that displays a simple plus icon.
 */
export function PlusIcon({
  testID,
  width = 24,
  height = 24,
  color = "#3B5162",
}) {
  //simple plus icon
  return (
    <Svg
      testID={testID}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="M12 5V19" />
      <Path d="M5 12H19" />
    </Svg>
  );
}

PlusIcon.propTypes = {
  testID: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
