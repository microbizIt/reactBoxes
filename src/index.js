import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Box(props) {
    return(
    <div className={'box ' + props.color } onClick={() => props.onClick()}>
        { props.color }
    </div>
    );
}

function Grid(props){
  const boxes = props.boxes
  return(
    <div className='grid'>
    {
      boxes.map((box, index) => (
        <Box key={index} color={ box.color } onClick={() => props.onClick(index)} />
      ))
    }
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.colors = ['unassigned', 'red', 'green', 'blue']

    const initStateBoxes = this.getInitState().boxes
    const initStateStats = this.getInitState().stats

    if( initStateBoxes !== null ){
      this.state = {
        boxes: JSON.parse(initStateBoxes),
        stats: JSON.parse(initStateStats)
      };
    } else {

      this.defaultNoBoxes = 16
      const stats = [this.defaultNoBoxes, 0, 0, 0]
      this.state = {
        noOfBoxes: this.defaultNoBoxes,
        boxes: Array(this.defaultNoBoxes).fill(
          {colorIndex: 0, color:this.colors[0]}
        ),
        stats: stats
      };
    }
  }
  handleBoxClick(i){
    const boxes = this.state.boxes.slice()
    
    boxes[i] = boxes[i].colorIndex === this.colors.length - 1 ? 
    {colorIndex: 0, color: this.colors[0]} : 
    {colorIndex: boxes[i].colorIndex + 1, color: this.colors[boxes[i].colorIndex + 1]}
    
    this.setState({
      boxes: boxes,
      stats: this.calcStats(boxes)
    })

   this.setLocalStorage(boxes)

  }
  getInitState(){
    const initState = {
      boxes: window.localStorage.getItem("phillipsBoxes"), 
      stats: window.localStorage.getItem("phillipsStats")
    }
    return initState
  }
  setLocalStorage(boxes){
    window.localStorage.setItem("phillipsBoxes", JSON.stringify(boxes));
    window.localStorage.setItem("phillipsStats", JSON.stringify(this.calcStats(boxes)));
  }
  calcStats(boxes){
    const stats = this.colors.map( (stat, index) => (
      boxes.filter(box => {
        if(box.colorIndex === index){
          return true
        } else {
          return false
        }
      }
      ).length
    ))
    return stats
  }
  handleNoOfBoxesInputChange(e){
    if(isNaN(e.target.value)){
      alert('Please enter a valid number.')
    }
    this.setState({noOfBoxes: e.target.value})
  }
  changeNoOfBoxes(){
    const boxes = Array(parseInt(this.state.noOfBoxes)).fill(
      {colorIndex: 0, color:this.colors[0]}
    )
    
    this.setState({boxes: boxes, stats:this.calcStats(boxes)})

    this.setLocalStorage(boxes)
  }
  resetBoxes(){
    const boxes = this.state.boxes.slice().map((box) => (
      box = {colorIndex:0, color:this.colors[0]}
    ))
    this.setState({boxes:boxes, stats:this.calcStats(boxes)})
    this.setLocalStorage(boxes)
  }
  render(){
    return(
      <div className='page'>
        <div className="noOfBoxes mb-4">
          <label>Change Number of Boxes:</label>
          <input 
            defaultValue={this.state.boxes.length} 
            onChange={(e) => this.handleNoOfBoxesInputChange(e)}
          />
          <button onClick={() => this.changeNoOfBoxes()}>Change</button>
        </div>
        <div className="reset mb-4">
          <button onClick={() => this.resetBoxes()}>RESET</button>
        </div>
        <div className='stats'>
        {
          this.state.stats.map((stat, index) => (
            <div key={index} className='stat'>{this.colors[index]}: {stat}</div>
          ))
        }
        </div>
        <Grid  boxes={this.state.boxes} onClick={(i) => this.handleBoxClick(i)} />
      </div>
    )
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
