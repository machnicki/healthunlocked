import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Tour extends Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    name: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.slideTo = this.slideTo.bind(this);
    this.slideBack = this.slideBack.bind(this);
    this.slideNext = this.slideNext.bind(this);
    this.finishTour = this.finishTour.bind(this);
    this.changePosition = this.changePosition.bind(this);

    this.state = {
      show: false,
      activeIndex: 0,
      length: this.props.steps.length,
      message: false,
      ref: null,
      areaShow: false,
      areaPosLeft: 0,
      areaWidth: 0,
      areaPosTop: 0,
      areaHeight: 0
    };
  }

  componentDidMount() {

    //var children = React.Children.map(this.props.children, function(child, idx) {
    //  console.log(child.ref);
    //
    //  this.props.steps.forEach(function(step, index) {
    //    if (step.ref == child.ref) {
    //      step['element'] = child;
    //
    //      React.cloneElement(child, { ref: 'step_' + idx });
    //    }
    //  });
    //}, this);

    if (this.state.length) {
      this.slideTo(0);
    }
  }

  componentDidUpdate() {
    if (!this.dontChangePosition) {

      this.changePosition();
    }
  }

  slideBack() {
    if (this.state.activeIndex > 0) {
      this.slideTo(this.state.activeIndex - 1);
    }
  }

  slideNext() {
    if (this.state.activeIndex < this.state.length) {
      this.slideTo(this.state.activeIndex + 1);
    }
  }

  slideTo(index) {
    let message = this.getMessage(index);

    this.dontChangePosition = false;

    this.setState({
      show: true,
      activeIndex: index,
      message: message
    });
  }

  finishTour() {
    this.setState({ show: false });
  }

  getMessage(index) {
    return this.props.steps[index].message || null;
  }

  changePosition() {
    if (this.state.show) {

      let refName = this.props.steps[this.state.activeIndex].ref,
          refDOM = React.findDOMNode(this.refs['step_' + refName]);

      this.setState({
        areaShow: true,
        areaLeft: refDOM.offsetLeft,
        areaWidth: refDOM.offsetWidth,
        areaTop: refDOM.offsetTop,
        areaHeight: refDOM.offsetHeight
      });

      this.dontChangePosition = true;
      console.log(refDOM);
    }
  }

  render() {
    return (
      <div className='Tour' style={{position: 'relative'}}>

        { this.state.show ?
          this.props.children.map((element, idx) => {
            if (this.props.steps.some(function(step, index) {
                  return step.ref == element.ref;
                })) {
              return React.cloneElement(element, {ref: 'step_' + element.ref});
            } else {
              return element;
            }
          })
          : this.props.children
        }
        <ReactCSSTransitionGroup transitionName="tour">
          { this.state.show ?
            <div key='tourContainer' className='tour-container'  style={this.state.areaShow ? {
                left: this.state.areaLeft + 20,
                top: this.state.areaTop + this.state.areaHeight + 20
              } : null}>
              <h3>{this.props.name}</h3>
              {this.state.message ? <p>{this.state.message}</p> : null }
              <div className='tour-buttons'>
                <button onClick={this.slideBack} disabled={ this.state.activeIndex == 0 ? true : false }>Back</button>
                <button onClick={this.slideNext} disabled={ this.state.activeIndex == (this.state.length - 1) ? true : false }>Next</button>
                <button onClick={this.finishTour}>Finish</button>
              </div>
              <p className="tour-footer">{this.state.activeIndex + 1} / {this.state.length}</p>
            </div>
            : null }
          { (this.state.show && this.state.areaShow) ?
            <div key='area' className='tour-area'  style={{
              left: this.state.areaLeft,
              width: this.state.areaWidth,
              top: this.state.areaTop,
              height: this.state.areaHeight
            }}></div>
            : null }
          </ReactCSSTransitionGroup>
      </div>
    );
  }
}