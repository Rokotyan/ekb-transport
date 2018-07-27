import React, { Component } from 'react';

// Styles
import './styles.css';

export default class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null,
    };
    this.toggleCheck = this.toggleCheck.bind(this);
    this.changeLength = this.changeLength.bind(this);
    this.changeSpeed = this.changeSpeed.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.changeTime = this.changeTime.bind(this);
  }

  onModeChange = (mode) => {
    const { onCheck } = this.props;
    if (mode !== this.state.mode) {
      this.setState({ mode }, () => {
        this.renderStory();
        onCheck(true);
      });
    }
  }

  toggleCheck(idx, arg, e) {
    const { onCheck } = this.props;
    if (onCheck instanceof Function) onCheck(arg);
  }

  changeLength(e) {
    // console.log(e.target.value);
    const { onLengthChange } = this.props;
    if (onLengthChange instanceof Function) onLengthChange(e.target.value);
    // e.preventDefault();
  }

  changeSpeed(e) {
    const { onSpeedChange } = this.props;
    if (onSpeedChange instanceof Function) onSpeedChange(e.target.value);
  }

  changeTime(e) {
    const { onTransitTimeChange } = this.props;
    if (onTransitTimeChange instanceof Function) onTransitTimeChange(e.target.value);
  }

  changeMode(e) {
    const { onTransitModeChange } = this.props;
    if (onTransitModeChange instanceof Function) onTransitModeChange(e.target.value);
  }


  renderStory = () => {
    const { speed, length } = this.props;
    if (this.state.mode === 0) {
      return (
        <div className="storymode">
          <div id="storymode-header">Транспортная сеть</div>
          <div id="storymode-content">{`На данной визуализации одного дня движения общественного транспорта Екатеринбурга можно увидеть, какие кварталы хорошо обеспечиваются наземным муниципальным транспортом, а какие нет; а также, в каких районах есть разнообразие транспорта, а какие обслуживаются только одним-двумя типами. Например, Химмаш обслуживается только троллейбусами, это значит, что если случается ДТП на троллейбусной линии, то жители Химмаша не смогут воспользоваться общественным транспортом, пока движение на линии парализовано.

            Данные о движении транспорта собраны с сайта edu-ekb.ru. В силу того, что не все компании-перевозчики открыто предоставляют эти данные, визуализация по большей части отражает передвижение только муниципального транспорта. 
            `}
          </div>
          <div className="checkboxplace">
            {'карта плотности'}
            <div className="toggle-group txt-s fr" >
              <label className="toggle-container">
                <input checked={this.props.isChecked} name="toggle" type="radio" />
                <div className="toggle toggle--white" onClick={this.toggleCheck.bind(this, this.props.isChecked, true)}>скрыть</div>
              </label>
              <label className="toggle-container">
                <input name="toggle" type="radio" />
                <div className="toggle toggle--white" onClick={this.toggleCheck.bind(this, this.props.isChecked, false)}>показать</div>
              </label>
            </div>
          </div>
          <div className="checkboxplace2">
            {'длина следа'}
            <div className="range range--s range--lighten50 col--6 fr" style={{ 'padding-top': '5px', 'padding-left': '5px' }}>
              <input type="range" value={length} min="30" max="500" step="1" onChange={this.changeLength.bind(this)} />
            </div>
          </div>
          <div className="checkboxplace2">
            {'скорость движения'}
            <div className="range range--s range--lighten50 col--6 fr" style={{ 'padding-top': '5px', 'padding-left': '5px' }}>
              <input type="range" value={speed} min="8000" max="300000" step="1000" onChange={this.changeSpeed.bind(this)} />
            </div>
          </div>
          <div className="storymode-legend">
            <div className="grid mb6">
              <div className="col h12" style={{ background: '#DE5145' }} />
              <div className="col h12" style={{ background: '#FFE364' }} />
              <div className="col h12" style={{ background: '#30CC6D' }} />
              <div className="col h12" style={{ background: '#5158B6' }} />
            </div>
            <div className="grid txt-xs">
              <div className="col align-center">автобус</div>
              <div className="col align-center">троллейбус</div>
              <div className="col align-center">трамвай</div>
              <div className="col align-center">микроавтобус</div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.mode === 1) {
      return (
        <div className="storymode">
          <div id="storymode-header">Изохроны транспортной доступности</div>
          <div id="storymode-content">{`Изохроны  —  наглядный способ показать, насколько далеко можно добраться от определенного места во всевозможные направления в понятном каждому человеку измерении  —  времени. 

            Нажмите в любое место карты, чтобы переместить маркер в новую точку и узнать, куда из нее можно добраться за `}
          </div>
          <div className="storymode-select">
            <div className="select-container">
              <select className="select select--s select--stroke select--stroke-white" onChange={this.changeTime.bind(this)}>
                <option value="900">15 минут</option>
                <option value="1800" selected="selected">30 минут</option>
                <option value="3600">60 минут</option>
              </select>
              <div className="select-arrow" />
            </div>
            {' '}
            <div className="select-container">
              <select className="select select--s select--stroke select--stroke-white" onChange={this.changeMode.bind(this)}>
                <option value="transit">на транспорте</option>
                <option value="driving">на машине</option>
                <option value="walking">пешком</option>
              </select>
              <div className="select-arrow" />
            </div>

          </div>
          <div id="storymode-content">{`
            Данные о времени предоставляются Google Maps Directions API.`}
          </div>
          <div className="storymode-legend">
            <div className="band" />
            <div className="grid txt-xs">
              <div className="col align-center">быстрее</div>
              <div className="col align-center">дольше</div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const {
      mode, isChecked, speed, value, transitmode, transittime,
    } = this.props;

    return (
      <div onModeChange={this.onModeChange(mode)} toggleCheck={this.toggleCheck} changeLength={this.changeLength} changeSpeed={this.changeSpeed} >
        {this.renderStory()}
      </div>
    );
  }
}
