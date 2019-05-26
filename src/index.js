import React from 'react';
import ReactDOM from 'react-dom';

var app = document.createElement("div");
app.id="app";
document.body.appendChild(app);
class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            highlight: "none",
            hovering:false
        };
        this.onHover = this.onHover.bind(this);
        this.onHoverEnd = this.onHoverEnd.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    onHover(event) {
        this.setState({hovering  : true});
    }
    onHoverEnd(event){
        this.setState({hovering:false});
        this.setState({highlight:"none"});
    }
    onMouseMove(event){
        let bounds = event.target.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        console.log(y);
        if (y < 25 && x>10 && x<40) {
            this.setState({highlight:"highlightTop"});
        }else if(x<25 && y>10 && y<40){
            this.setState({highlight:"highlightLeft"});
        }else if(y>25 && x<40 && x>10){
            this.setState({highlight:"highlightBottom"});
        }else if(x>25 && y<40 && y>10){
            this.setState({highlight:"highlightRight"});
        }else{
            this.setState({highlight:"none"});
        }

    }
    getClass(){
        console.log(this.state);
        console.log(this.state.highlight);
        return 'square '+this.state.highlight;
    }

    render() {
        return(
            <button
                className={this.getClass()}
                onMouseEnter={this.onHover}
                onMouseLeave={this.onHoverEnd}
                onMouseMove={this.onMouseMove}
            >
                {this.props.value}
            </button>
        );
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
            />
        );
    }
    createTable() {
        let table = [];

        // Outer loop to create parent
        for (let i = 0; i < 10; i++) {
            let children = [];
            //Inner loop to create children
            for (let j = 0; j < 10; j++) {
                children.push(this.renderSquare(i))
            }
            //Create the parent and add the children
            table.push(<div className="board-row">{children}</div>)
        }
        return table
    }

    render() {

        return (
            <div className="GameHolder">
                <div className="status">{status}</div>
                {this.createTable()}
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
    );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('app')
);
