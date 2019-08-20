import 'core-js';
import 'regenerator-runtime';
import 'isomorphic-fetch';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
