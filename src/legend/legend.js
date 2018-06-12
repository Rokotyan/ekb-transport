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
    const { onCheck, isChecked } = this.props;
    if (onCheck instanceof Function) onCheck(arg);
  }


  renderStory = () => {
    if (this.state.mode === 0) {
      return (
        <div className="storymode">
          <div id="storymode-header">Транспортная сеть</div>
          <div id="storymode-content">{`Можно увидеть, какие кварталы хорошо обеспечиваются наземным муниципальным транспортом, а какие нет; а также, в каких районах есть разнообразие транспорта, а какие обслуживаются только одним-двумя типами. Например, Химмаш обслуживается только троллейбусами, это значит, что если случается ДТП на троллейбусной линии, то жители Химмаша не смогут воспользоваться общественным транспортом, пока движение на линии парализовано.

            Данные о движении транспорта собраны с сайта edu-ekb.ru. В силу того, что не все компании-перевозчики открыто предоставляют эти данные, визуализация по большей части отражает передвижение только муниципального транспорта. 
            `}
          </div>
          <div className="checkboxplace">
            {'Карта плотности'}
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
              <div className="col align-center">маршрутка</div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.mode === 1) {
      return (
        <div className="storymode">
          <div id="storymode-header">Изохроны транспортной доступности</div>
          <div id="storymode-content">{`Изохроны  —  наглядный способ показать, насколько далеко можно добраться от определенного места во всевозможные направления в понятном каждому человеку измерении  —  времени. 

            Кликните по карте, что бы переместить маркер в новую точку и узнать, куда из нее можно добраться за `}
          </div>
          <div className="storymode-select">
            <div className="select-container">
              <select className="select select--s select--stroke select--stroke-white">
                <option>15 минут</option>
                <option>30 минут</option>
                <option>60 минут</option>
              </select>
              <div className="select-arrow" />
            </div>
            {' '}
            <div className="select-container">
              <select className="select select--s select--stroke select--stroke-white">
                <option>на транспорте</option>
                <option>на машине</option>
                <option>пешком</option>
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
    const { mode } = this.props;
    const { isChecked } = this.props;

    return (
      <div onModeChange={this.onModeChange(mode)} toggleCheck={this.toggleCheck}>
        {this.renderStory()}
      </div>
    );
  }
}
