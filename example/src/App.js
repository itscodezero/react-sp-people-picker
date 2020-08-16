import React from 'react'

import { SpPeoplePicker } from '../react-sp-people-picker'
import 'react-sp-people-picker/dist/index.css'

const App = () => {
  const handleGetSeletedUser = (user) => {
    console.log(user);
  };
  return <SpPeoplePicker
    getSelectedUser={handleGetSeletedUser}
  ></SpPeoplePicker>
}

export default App
