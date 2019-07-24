import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { describe, it } from "mocha";

import WindowButton from "../app/components/WindowControls/WindowButton";
import WindowControls from "../app/components/WindowControls";

describe("<WindowControls />", () => {
  it("renders with window buttons", () => {
    const wrapper = shallow(<WindowControls />);
    expect(wrapper.containsMatchingElement(<WindowButton />)).to.equal(true);
  });
});
