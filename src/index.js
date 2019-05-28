import React from 'react';
import ReactDOM from 'react-dom';

let app = document.createElement("div");
app.id="app";
document.body.appendChild(app);

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    getClass(){
        return 'square '+this.props.value;
    }
    render() {
        return(
            <span
                className={this.getClass()}
            >
                {this.props.j+", "+this.props.i}
            </span>
        );
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.left = 0;
        this.top = 0;
        this.arLength=10;
        this.state = {
            arLength:10,
            squares: Array(this.arLength).fill(Array(this.arLength).fill("none")),
            xIsNext: true,
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        console.log(this.state);
    }
    onMouseMove(event){
        let bounds = event.target.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        let j = Math.floor((event.clientX - this.state.left)/50);
        let i = Math.floor((event.clientY - this.state.top)/50);

        i = i<0?0:i;
        j = j<0?0:j;

        const squares = Array(this.arLength).fill(Array(this.arLength).fill("none"));
        const jsquares = squares[i].slice();
        if (y > 0 && y < 20 && x>10 && x<40) {
            jsquares[j]="highlightTop";
            if(i>0){
                const j2squares = squares[i-1].slice();
                j2squares[j]="highlightBottom";
                squares[i-1]=j2squares;
            }
        }else if(x > 0 && x<20 && y>10 && y<40){
            jsquares[j]="highlightLeft";
            if(j>0){
                jsquares[j-1]="highlightRight";
            }
        }else if(y < 50 && y>30 && x<40 && x>10) {
            jsquares[j] = "highlightBottom";
            if(i<this.arLength-1){
                const j2squares = squares[i+1].slice();
                j2squares[j]="highlightTop";
                squares[i+1]=j2squares;
            }
        }else if(x < 50 && x>30 && y<40 && y>10){
            jsquares[j]="highlightRight";
            if(j<this.arLength-1){
                jsquares[j+1]="highlightLeft";
            }
        }

        squares[i]=jsquares;
        this.setState({squares: squares});
    }
    renderSquare(i,j) {
        return (
            <Square
            value={this.state.squares[i][j]}
            j={j}
            i={i}
            />
        );
    }
    createTable() {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < this.state.squares.length; i++) {
            let children = [];
            //Inner loop to create children
            for (let j = 0; j < this.state.squares[i].length; j++) {
                children.push(this.renderSquare(i,j));
            }
            //Create the parent and add the children
            table.push(<div className="board-row">{children}</div>);
        }
        return table
    }
    getSize(bounds){
        this.setState({left: bounds.left});
        this.setState({top: bounds.top});
    }
    refCallback = element => {
        if (element) {
            this.getSize(element.getBoundingClientRect());
        }
    };

    render() {
        return (
            <div ref={this.refCallback} className="GameHolder"
                 onMouseMove={this.onMouseMove}>
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
