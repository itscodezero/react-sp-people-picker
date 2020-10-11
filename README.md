# react-sp-people-picker

> SharePoint People Picker built for React Projects

[![NPM](https://img.shields.io/npm/v/react-sp-people-picker.svg)](https://www.npmjs.com/package/react-sp-people-picker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-sp-people-picker
```

## Usage

```jsx
import React, { Component } from 'react'

import SpPeoplePicker from 'react-sp-people-picker'
import 'react-sp-people-picker/dist/index.css'

class Example extends Component {
  render() {
    return <SpPeoplePicker onSelect={handleSelect} />
  }
}
```

You can use the component within your function component as well.
Add the following tag into your jsx file.

```
<SpPeoplePicker onSelect={handleSelect} />
```

Just implement handleSelect(user) method which gets the selected SP User object as parameter.

For detailed usage details please read [this blog post](https://www.arreyaaar.com/post/sharepoint-people-picker-component-for-reactjs-projects).

## License

MIT © [itszerocode](https://github.com/itszerocode)
