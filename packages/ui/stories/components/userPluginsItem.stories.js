import React from 'react';
import { UserPluginsItem } from '../..';

export default {
  title: 'Components/User plugins item'
};

export const Basic = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      description='test description'
      image='https://cdn.svgporn.com/logos/emacs.svg'
      author='test user'
      handleDelete={() => alert('Plugin deleted')}
    />
  </div>
);

export const WithLongDescription = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      description=' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mollis neque eu leo suscipit, eu cursus mauris dignissim. Suspendisse accumsan, dolor ut semper faucibus, justo enim bibendum mauris, vel semper velit nulla id ex. Phasellus in placerat diam. In hac habitasse platea dictumst. In sed lacinia ante. Sed id tempor massa. Vestibulum ornare leo felis, nec gravida sapien euismod a. Suspendisse in tincidunt libero, nec gravida risus. Integer ornare lorem nec urna tristique, quis consectetur sapien tristique. Suspendisse euismod felis sit amet tortor cursus, ac egestas massa vulputate. Cras pharetra libero sed sapien viverra dignissim. Maecenas quis velit ultricies, malesuada purus id, eleifend ipsum. Duis vehicula nisi non efficitur lobortis. Aliquam eu congue massa, vitae vulputate ipsum. Nullam enim urna, fringilla porttitor enim nec, malesuada molestie arcu. '
      image='https://cdn.svgporn.com/logos/emacs.svg'
      author='test user'
      handleDelete={() => alert('Plugin deleted')}
    />
  </div>
);

export const WithNoIcon = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      author='test user'
    />
  </div>
);

export const Loading = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      description='test description'
      author='test user'
      loading={true}
    />
  </div>
);

export const Error = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      description='test description'
      author='test user'
      error={true}
    />
  </div>
);

export const SeveralInAList = () => (
  <div className='bg'>
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      author='test user'
    />
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      author='test user'
    />
    <UserPluginsItem
      path='/usr/bin/local'
      name='test plugin'
      author='test user'
    />
  </div>
);
