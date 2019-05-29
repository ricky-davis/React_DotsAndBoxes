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
        let classBuffer="square ";
        let addHighlight=true;
        let complete = this.props.complete;
        let selEdges = Array.from(this.props.selEdges);
        selEdges.forEach(element=>{
            classBuffer+=element+" ";
            if(element==="topSel" && this.props.highlight ==="highlightTop")
                addHighlight=false;
            if(element==="bottomSel" && this.props.highlight ==="highlightBottom")
                addHighlight=false;
            if(element==="leftSel" && this.props.highlight ==="highlightLeft")
                addHighlight=false;
            if(element==="rightSel" && this.props.highlight ==="highlightRight")
                addHighlight=false;
        });
        if(addHighlight)
            classBuffer+=this.props.highlight+" ";
        if(complete){
            classBuffer+=complete+" ";
        }
        return classBuffer;
    }
    render() {
        return(
            <span
                className={this.getClass()}
            >
                {/*{this.props.j+", "+this.props.i}*/}
            </span>
        );
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.left = 0;
        this.top = 0;
        this.arLength=5;
        this.state = {
            arLength:this.arLength,
            highlightSquares: Array(this.arLength).fill(Array(this.arLength).fill("none")),
            selectedEdges: Array(this.arLength).fill(Array(this.arLength).fill([])),
            completedBoxes: Array(this.arLength).fill(Array(this.arLength)),
            t1IsNext: true,
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        console.log(this.state);
    }
    getCoords(event){
        let bounds = event.target.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        let i = Math.floor((event.clientX - this.state.left) / 50);
        let j = Math.floor((event.clientY - this.state.top) / 50);

        i = i < 0 ? 0 : i;
        j = j < 0 ? 0 : j;

        return [i,j,x,y];
    }
    findEdge(x,y){
        if (y >= 0 && y < 20 && x>10 && x<40) {
            return "top";
        }else if(x >= 0 && x<20 && y>10 && y<40){
            return "left"
        }else if(y <= 55 && y>30 && x<40 && x>10) {
            return "bottom"
        }else if(x <= 55 && x>30 && y<40 && y>10){
            return "right"
        }
        return "none";
    }
    gameLogic(i,j){
        const mod=[-1,0,1];
        let compBox=false;
        for(let k=0;k<mod.length;k++) {
            let ni = i+mod[k];
            for(let l=0;l<mod.length;l++) {
                let nj = j+mod[l];
                try {
                    const curBox = this.state.selectedEdges[nj][ni];
                    if (!this.state.completedBoxes[nj][ni]) {
                        if (curBox.includes("topSel") && curBox.includes("bottomSel")
                            && curBox.includes("leftSel") && curBox.includes("rightSel")) {
                            compBox = true;
                            let completedBoxes = this.state.completedBoxes;
                            let completedBoxesSliced = completedBoxes[nj].slice();
                            let j2completedBoxesSliced = completedBoxesSliced.slice();
                            if (this.state.t1IsNext) {
                                j2completedBoxesSliced[ni] = "team1Comp";
                            } else {
                                j2completedBoxesSliced[ni] = "team2Comp";
                            }
                            completedBoxesSliced = j2completedBoxesSliced;
                            completedBoxes[nj] = completedBoxesSliced;
                            this.setState({completedBoxes: completedBoxes});
                        }
                    }
                }catch{}
            }
        }
        if(!compBox) {
            this.setState({t1IsNext: !this.state.t1IsNext});
        }
    }
    onClick(event) {
        let [i,j,x,y] = this.getCoords(event);
        console.log(i);
        let noMove=false;
        let added="none";
        const selectedEdges = this.state.selectedEdges;
        const selectedEdgesSliced = selectedEdges[j].slice();
        let edges;
        switch(this.findEdge(x,y)){
            case "top":
                if(selectedEdges[j][i].includes("topSel")){
                    noMove=true;
                }
                edges = selectedEdgesSliced[i].slice();
                edges[0] = "topSel";
                selectedEdgesSliced[i] = edges;
                if(j>0){
                    const j2selectedEdgesSliced = selectedEdges[j-1].slice();

                    edges = j2selectedEdgesSliced[i].slice();
                    edges[1] = "bottomSel";
                    j2selectedEdgesSliced[i] = edges;

                    selectedEdges[j-1]=j2selectedEdgesSliced;
                }
                break;
            case "left":
                if(selectedEdges[j][i].includes("leftSel")){
                    noMove=true;
                }
                edges = selectedEdgesSliced[i].slice();
                edges[2] = "leftSel";
                selectedEdgesSliced[i] = edges;
                if(i>0){
                    edges = selectedEdgesSliced[i-1].slice();
                    edges[3] = "rightSel";
                    selectedEdgesSliced[i-1] = edges;
                }
                break;
            case "bottom":
                if(selectedEdges[j][i].includes("bottomSel")){
                    noMove=true;
                }
                edges = selectedEdgesSliced[i].slice();
                edges[1] = "bottomSel";
                selectedEdgesSliced[i] = edges;
                if(j<this.arLength-1){
                    const j2selectedEdgesSliced = selectedEdges[j+1].slice();

                    edges = j2selectedEdgesSliced[i].slice();
                    edges[0] = "topSel";
                    j2selectedEdgesSliced[i] = edges;

                    selectedEdges[j+1]=j2selectedEdgesSliced;
                }
                break;
            case "right":
                if(selectedEdges[j][i].includes("rightSel")){
                    noMove=true;
                }
                edges = selectedEdgesSliced[i].slice();
                edges[3] = "rightSel";
                selectedEdgesSliced[i] = edges;

                if(i<this.arLength-1){
                    edges = selectedEdgesSliced[i+1].slice();
                    edges[2] = "leftSel";
                    selectedEdgesSliced[i+1] = edges;
                }
                break;
            case "none":
                noMove=true;
                break;
        }


        selectedEdges[j]=selectedEdgesSliced;
        this.setState({selectedEdges: selectedEdges});
        if(!noMove) {
            this.gameLogic(i, j);
        }
    }
    onMouseMove(event){
        let [i,j,x,y] = this.getCoords(event);

        const highlightSquares = Array(this.arLength).fill(Array(this.arLength).fill("none"));
        const jhighlightSquares = highlightSquares[j].slice();

        let curColo=this.state.t1IsNext?"Blue":"Red";
        if(this.state.completedBoxes[j][i]){
            return;
        }
        switch(this.findEdge(x,y)) {
            case "top":
                if (this.state.selectedEdges[j][i].includes("topSel")) {
                    break;
                } else {
                    jhighlightSquares[i] = "highlightTop" + curColo + " highlight" + curColo;
                    if (j > 0) {
                        const j2highlightSquares = highlightSquares[j - 1].slice();
                        j2highlightSquares[i] = "highlightBottom" + curColo;
                        highlightSquares[j - 1] = j2highlightSquares;
                    }
                    break;
                }
            case "left":
                if(this.state.selectedEdges[j][i].includes("leftSel")){
                    break;
                }
                jhighlightSquares[i]="highlightLeft"+ curColo +" highlight"+curColo;
                if(i>0){
                    jhighlightSquares[i-1]="highlightRight"+ curColo;
                }
                break;
            case "bottom":
                if(this.state.selectedEdges[j][i].includes("bottomSel")){
                    break;
                }
                jhighlightSquares[i] = "highlightBottom"+ curColo +" highlight"+curColo;
                if(j<this.arLength-1){
                    const j2highlightSquares = highlightSquares[j+1].slice();
                    j2highlightSquares[i]="highlightTop"+ curColo;
                    highlightSquares[j+1]=j2highlightSquares;
                }
                break;
            case "right":
                if(this.state.selectedEdges[j][i].includes("rightSel")){
                    break;
                }
                jhighlightSquares[i]="highlightRight"+ curColo +" highlight"+curColo;
                if(i<this.arLength-1){
                    jhighlightSquares[i+1]="highlightLeft"+ curColo;
                }
                break;
            case "none":
                jhighlightSquares[i]="none";
                break;
        }
        highlightSquares[j]=jhighlightSquares;
        this.setState({highlightSquares: highlightSquares});
    }
    renderSquare(i,j) {
        return (
            <Square key={i+","+j}
            highlight={this.state.highlightSquares[i][j]}
            selEdges={this.state.selectedEdges[i][j]}
            complete={this.state.completedBoxes[i][j]}
            j={j}
            i={i}
            />
        );
    }
    createTable() {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < this.state.highlightSquares.length; i++) {
            let children = [];
            //Inner loop to create children
            for (let j = 0; j < this.state.highlightSquares[i].length; j++) {
                children.push(this.renderSquare(i,j));
            }
            //Create the parent and add the children
            table.push(<div key={"squareBR"+i} className="board-row">{children}</div>);
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
            <div key={"gameBoardHolder"} ref={this.refCallback} className="GameHolder"
                 onMouseMove={this.onMouseMove}
                 onClick={this.onClick}
            >
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
