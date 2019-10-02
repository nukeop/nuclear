import React from 'react';
import chai from 'chai';
import spies from 'chai-spies';
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import SidebarMenu from '../app/components/SidebarMenu';
import SidebarMenuCategoryHeader from '../app/components/SidebarMenu/SidebarMenuCategoryHeader';
import SidebarMenuItem from '../app/components/SidebarMenu/SidebarMenuItem';

chai.use(spies);
const { expect } = chai;

function render(headerText, items, compact = false) {
  return shallow(
    <SidebarMenu>
      <SidebarMenuCategoryHeader compact={compact} headerText={headerText} />
      {items.map(item => (
        <SidebarMenuItem key={item}>
          <span>{item}</span>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

const MOCKED_ITEMS = ['foo', 'bar', 'baz', 'blah'];

describe('<SidebarMenu /> and friends', () => {
  it('should accept <SidebarMenuCategoryHeader /> as child', () => {
    const wrapper = render('default', MOCKED_ITEMS);

    expect(wrapper.find(SidebarMenuCategoryHeader)).to.have.lengthOf(1);
  });

  it('should accept <SidebarMenuItem/> as child', () => {
    const wrapper = render('default', MOCKED_ITEMS);

    expect(wrapper.find(SidebarMenuItem)).to.have.lengthOf(MOCKED_ITEMS.length);
  });

  it('should hide header text when minimized', () => {
    const wrapper = render('compact', MOCKED_ITEMS, true);

    expect(wrapper.find('.sidebar_menu_category_header')).to.have.lengthOf(0);
  });
});
