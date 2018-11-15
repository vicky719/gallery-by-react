require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../sources/imgConfig.json');

//初始化图片路径
var imgLists = (function (imageDatas) {
  for (var i in imageDatas) {
    imageDatas[i].src = require('../images/' + imageDatas[i].src);
  }
  return Array.from(imageDatas);
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="image-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
