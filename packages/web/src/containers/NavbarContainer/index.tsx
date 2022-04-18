import React from 'react';

import { Navbar } from '../../components/Navbar';
import { SearchBoxContainer } from '../SearchBoxContainer';

export const NavbarContainer: React.FC = () => <Navbar>
  <SearchBoxContainer />
</Navbar>;
