import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import Timer from "./Timer.vue";

describe("Timer", () => {
  it("компонент отображается", () => {
    const wrapper = mount(Timer);

    expect(wrapper.exists()).toBe(true);
  });
});