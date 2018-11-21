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

//获取区间内的一个随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0°~30°的随机值
function getDegRandom30() {
  return (Math.random() > 0.5 ? '' : '-' ) + Math.ceil(Math.random() * 30);
}

// 图片组件
class ImgFigure extends React.Component {
  handleClick = (event) => {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    event.stopPropagation();
    event.preventDefault();
  };
  
  render() {
    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      ['MS', 'MOZ', 'Webkit', 'O', ''].forEach(function (v) {
        styleObj[v + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      }.bind(this));
    }
    //如果是居中的图片，z-index设为11
    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInVerse ? ' is-inverse' : '';
    return (
      <figure style={styleObj} className={imgFigureClassName} ref="img" onClick={this.handleClick}>
        <img src={this.props.data.src} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

//APP
class AppComponent extends React.Component {
  constructor() {
    super();
    this.Constant = {
      centerPos: { //中心坐标
        left: 0,
        right: 0
      },
      hPosRange: {//水平方向取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {//垂直方向取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };
    //react中state变化后，视图会重新渲染
    this.state = {
      imgsArrangeArr: [
        {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInVerse: false //图片正反面 false:正面(默认) true:反面
        }
      ]
    }
  }
  
  /*
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {Function} 这是一个闭包函数，期内return一个真正待被执行的函数
   */
  inverse(index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInVerse = !imgsArrangeArr[index].isInVerse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }
  
  /*
   * 被点击图片居中
   * @param index 被居中的图片索引
   */
  center(index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }
  
  /*
   * 布局所有图片
   * @param centerIndex:指定居中哪个图片
    */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      
      //存储上测区域图片信息
      imgsArrangeTopArr = [],
      //上测区域显示0~1张图片
      topImgNum = Math.floor(Math.random() * 2),
      //标记上测这张图片是从数组哪个位置拿出来的
      topImgSpliceIndex = 0,
      //取出要居中的图片信息
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    
    //居中centerIndex的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    //中间的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;
    //是否为中间图片
    imgsArrangeCenterArr[0].isCenter = true;
    
    //取出要布局上测的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    
    //布局位于上测的图片
    imgsArrangeTopArr.forEach(function (v, k) {
      imgsArrangeTopArr[k] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: getDegRandom30(),
        isCenter: false
      }
    });
    //布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;
      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
        },
        rotate: getDegRandom30(),
        isCenter: false
      }
    }
    //合并上、中、左右两侧图片信息的数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }
  
  //组件装载之后调用一次,render之后调用,可使用this.refs获取dom节点
  componentDidMount() {
    // 首先拿到舞台大小
    var stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    
    //拿到一个imgFigure的大小
    var imgFigureDOM = this.refs.imgFigure0.refs.img,
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);
    
    //计算图片中心位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    // 舞台左侧区域取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;//左侧x最小值
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;//左侧x最大值
    // 舞台右侧区域取值范围
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;//右侧x最小值
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;//右侧x最大值
    //y轴取值范围
    this.Constant.hPosRange.y[0] = -halfImgH;//y最小值
    this.Constant.hPosRange.y[1] = stageH - halfImgH;//y最大值
    
    // 上侧区域取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;//y最小值
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;//y最大值
    this.Constant.vPosRange.x[0] = halfStageW - imgW;//x最小值
    this.Constant.vPosRange.x[1] = halfStageW;//x最大值
    
    //第一张图片居中
    this.rearrange(0);
  }
  
  //组装生成这个组件的html结构，这时候调用this.refs.xx会返回null
  render() {
    var controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach(function (value, k) {
      if (!this.state.imgsArrangeArr[k]) {
        this.state.imgsArrangeArr[k] = {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInVerse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={k} ref={'imgFigure' + k} inverse={this.inverse(k)}
                                 arrange={this.state.imgsArrangeArr[k]} center={this.center(k)}/>)
    }.bind(this));//bind this指向react环境对象
    return (
      <section className="stage" ref="stage">
        <section className="image-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
