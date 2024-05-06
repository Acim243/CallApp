import React, { Children } from 'react'

const Each = ({render, of, keyIndex}) =>
Children.toArray(of?.map((item, index, self) => render(item, keyIndex ? item[keyIndex] : index, self, keyIndex ? index : undefined)))



export default Each