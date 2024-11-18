"use client";

import { Avatar, Button } from "@nextui-org/react";

import { useTheme } from "next-themes";

const handleThemeToggle = (theme: string | undefined) => {
  if (theme === "light") {
    return "dark";
  }
  return "light";
};

const Test = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-auto mt-6 w-fit text-center space-y-3">
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        size="lg"
        className="mx-auto"
      />
      <p>Bob</p>

      <div className="space-x-3">
        <Button
          onClick={() => {
            setTheme(handleThemeToggle(theme));
          }}
        >
          Toggle Theme
        </Button>
        <br />
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aut, sequi
          dolorum modi officia magnam at! Beatae natus dolores veritatis
          deleniti magnam accusantium neque, quam incidunt esse. Corrupti
          voluptatibus soluta voluptates?
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br /> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
          numquam esse, laboriosam harum, dolore dolorem corrupti veniam enim
          laudantium magnam illo unde repellat eligendi obcaecati accusamus non
          assumenda minus alias.
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ea dolorem
          similique quae nesciunt dicta cum provident, atque suscipit temporibus
          impedit laborum cumque, ad autem blanditiis commodi neque? Temporibus,
          fugiat.
          <br />
        </p>
      </div>
    </div>
  );
};

export default Test;
