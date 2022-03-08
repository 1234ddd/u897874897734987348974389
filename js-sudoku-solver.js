'use strict';


function isValidSudoku() {
    let store = {
        rows: {},
        cols: {},
        square: {},
    };
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const ci = (i*9)+j;
            const cell = document.getElementById('C'+ci);
            const box = cell.value;

            cell.style.color = '#000';
            cell.style.backgroundColor = '#fFF';

            if (!store["rows"][i] && box !== "") {
                store["rows"][i] = [];
                store["rows"][i].push(box);
            } else if (box !== "" && !store["rows"][i].includes(box)) {
                store["rows"][i].push(box);
            } else if (store["rows"][i] && store["rows"][i].includes(box)) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }

            if (!store["cols"][j] && box !== "") {
                store["cols"][j] = [];
                store["cols"][j].push(box);
            } else if (box !== "" && !store["cols"][j].includes(box)) {
                store["cols"][j].push(box);
            } else if (store["cols"][j] && store["cols"][j].includes(box)) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }

            const squareRowId = Math.ceil((i + 1) / 3);
            const squareColId = Math.ceil((j + 1) / 3);
            const squareId = `${squareRowId}-${squareColId}`;

            if (!store["square"][squareId] && box !== "") {
                store["square"][squareId] = [];
                store["square"][squareId].push(box);
            } else if (box !== "" && !store["square"][squareId].includes(box)) {
                store["square"][squareId].push(box);
            } else if (
                store["square"][squareId] &&
                store["square"][squareId].includes(box)
            ) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }
        }
    }
    return true;
}

function SudokuSolver() {
    var puzzle_table = [];
    function check_candidate(num, row, col) {
        for (var i = 0; i < 9; i++) {
            var b_index = ((Math.floor(row / 3) * 3) + Math.floor(i / 3)) * 9 + (Math.floor(col / 3) * 3) + (i % 3);
            if (num === puzzle_table[(row * 9) + i] ||
                num === puzzle_table[col + (i * 9)] ||
                num === puzzle_table[b_index]) {
                return false;
            }
        }
        return true;
    }
    function get_candidate(index) {
        if (index >= puzzle_table.length) {
            return true;
        } else if (puzzle_table[index] !== 0) {
            return get_candidate(index + 1);
        }

        for (var i = 1; i <= 9; i++) {
            if (check_candidate(i, Math.floor(index / 9), index % 9)) {
                puzzle_table[index] = i;
                if (get_candidate(index + 1)) {
                    return true;
                }
            }
        }

        puzzle_table[index] = 0;
        return false;
    }

    function chunk_in_groups(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i += 9) {
            result.push(arr.slice(i, i + 9));
        }
        return result;
    }

    this.solve = function (puzzle, options) {
        options = options || {};
        var result = options.result || 'string';
        puzzle_table = puzzle.split('').map(function (v) { return isNaN(v) ? 0 : +v });

        if (puzzle.length !== 81) return 'Puzzle is not valid.'
        return !get_candidate(0) ? 'No solution found.' : result === 'chunks' ? chunk_in_groups(puzzle_table) : result === 'array' ? puzzle_table : puzzle_table.join('');
    }
}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = SudokuSolver;
    }
    exports.SudokuSolver = SudokuSolver;
} else {
    window.SudokuSolver = SudokuSolver;
}

function fadeColor(id,start_hex,stop_hex,difference,delay,color_background) {
    //Default values...
    if(!difference) difference = 20;
    if(!delay) delay = 100;
    if(!start_hex) start_hex = "#FFFFFF";
    if(!stop_hex) stop_hex = "#000000";
    if(!color_background) color_background = "c";

    var ele = document.getElementById(id);
    if(!ele) return;
    var start= hex2num(start_hex);
    var stop = hex2num(stop_hex);

    //Make it numbers rather than strings.
    for(var i=0;i<3;i++) {
        start[i] = Number(start[i]);
        stop[i] = Number(stop[i]);
    }

    //Morph one colour to the other. If the start color is greater than the stop colour, start color will
    //	be decremented till it reaches the stop color. If it is lower, it will incremented.
    for(var i=0;i<3;i++) {
        if (start[i] < stop[i]) {
            start[i] += difference;
            if(start[i] > stop[i]) start[i] = stop[i];//If we have overshot our target, make it equal - or it won't stop.
        }
        else if(start[i] > stop[i]) {
            start[i] -= difference;
            if(start[i] < stop[i]) start[i] = stop[i];
        }
    }

    //Change the color(or the background color).
    var color = "rgb("+start[0]+","+start[1]+","+start[2]+")";
    if(color_background == "b") {
        ele.style.backgroundColor = color;
    } else {
        ele.style.color = color;
    }

    //Stop if we have reached the target.
    if((start[0] == stop[0]) && (start[1] == stop[1]) && (start[2] == stop[2])) return;

    start_hex = num2hex(start);
    //Keep calling this function
    window.setTimeout("fadeColor('"+id+"','"+start_hex+"','"+stop_hex+"',"+difference+","+delay+",'"+color_background+"')",delay);
}

var solver = new SudokuSolver();
var currentCell = null;

function hex2num(hex) {
    if(hex.charAt(0) == "#") {
        hex = hex.slice(1);
    }
    hex = hex.toUpperCase();
    var hex_alphabets = "0123456789ABCDEF";
    var value = new Array(3);
    var k = 0;
    var int1,int2;
    for(var i=0;i<6;i+=2) {
        int1 = hex_alphabets.indexOf(hex.charAt(i));
        int2 = hex_alphabets.indexOf(hex.charAt(i+1));
        value[k] = (int1 * 16) + int2;
        k++;
    }
    return(value);
}

function num2hex(triplet) {
    var hex_alphabets = "0123456789ABCDEF";
    var hex = "#";
    var int1,int2;
    for(var i=0;i<3;i++) {
        int1 = triplet[i] / 16;
        int2 = triplet[i] % 16;

        hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
    }
    return(hex);
}

function revealCell(obj) {
    document.getElementById('runtime').style.display = 'none';
    if (isValidSudoku()) {
        var cellNo = jQuery(obj).data('cell');

        var s = '';
        for (var i = 0; i < 81; ++i) {
            var y = document.getElementById('C' + i).value;
            if (y >= 1 && y <= 9) {
                s += '' + y;
            } else {
                s += '.';
            }
        }

        var time_beg = new Date().getTime();
        var x = solver.solve(s);

        var t = (new Date().getTime() - time_beg) / 1000.0;

        s = '';

        console.log(x[cellNo]);
        var cell = document.getElementById('C' + cellNo);
        if (cell.value === '') {
            document.getElementById('C' + cellNo).value = x[cellNo];

            fadeColor(cell.id, "#FFFFFF", "#000000", 10, 30, "c");
        } else {
            if (call.value !== x[cellNo]) {
                document.getElementById('C' + cellNo).value = x[cellNo];
                fadeColor(cell.id, "#FFFFFF", "#000000", 10, 30, "c");
            }
        }
    } else {
        document.getElementById('runtime').innerHTML = '<div style="padding:0 10px;"><p class="alert alert-danger">Puzzle is not correct we have found invalid entries.</p></div>';
        document.getElementById('runtime').style.display = 'block';
    }

}



function solve() {
    document.getElementById('runtime').style.display = 'none';
    if (isValidSudoku()) {
        var s = '';
        for (var i = 0; i < 81; ++i) {
            var y = document.getElementById('C' + i).value;
            if (y >= 1 && y <= 9) {
                s += '' + y;
            } else {
                s += '.';
            }
        }

        var time_beg = new Date().getTime();
        var x = solver.solve(s);

        var t = (new Date().getTime() - time_beg) / 1000.0;


        document.getElementById('runtime').innerHTML = 'Solved puzzle in ' + t + ' seconds ( ' + t * 1000.0 + ' ms ).';
        s = '';

        for (var z = 0; z < 81; ++z) {
            document.getElementById('C' + z).value = x[z];
        }
        document.getElementById('runtime').style.display = 'block';
    } else {
        document.getElementById('runtime').innerHTML = '<div style="padding:0 10px;"><p class="alert alert-danger">Puzzle is not correct we have found invalid entries.</p></div>';
        document.getElementById('runtime').style.display = 'block';
    }
}

function validateBoard() {
    var s = '';
    for (var i = 0; i < 81; ++i) {
        var y = document.getElementById('C' + i).value;
        if (y >= 1 && y <= 9) {
            s += '' + y;
        } else {
            s += '.';
        }
    }

    var time_beg = new Date().getTime();
    var x = solver.solve(s);

    var t = (new Date().getTime() - time_beg) / 1000.0;

    s = '';

    for (var z = 0; z < 81; ++z) {
        var cell = document.getElementById('C' + z);
        if (cell.value!=='' && cell.value!==x[z]) {
            cell.style.color = "#C00";
        }
    }
}

function set_9x9(str) {
    if (str != null && str.length >= 81) {
        for (var i = 0; i < 81; ++i) {
            document.getElementById('C' + i).value = '';
        }
        for (var j = 0; j < 81; ++j) {
            if (str.substr(j, 1) >= 1 && str.substr(j, 1) <= 9) {
                document.getElementById('C' + j).value = str.substr(j, 1);
            }
        }
    }
}
function getGroups() {

}

function checkBlockIndex(c,blocks) {
    var block_index = 0;
    for(var block in blocks) {
        if (block.includes(c)) {
            return(block_index);
        }
        block_index++;
    }
    return(-1);
}

function draw_9x9() {
    var s = '<table class="table">\n';

    for (var i = 0; i < 9; ++i) {
        s += '<tr class="sr-'+i+'">';
        for (var j = 0; j < 9; ++j) {
            var c = 'cell';
            if ((i + 1) % 3 === 0 && j % 3 === 0) {
                c = 'cell3';
            } else if ((i + 1) % 3 === 0) {
                c = 'cell1';
            } else if (j % 3 === 0) {
                c = 'cell2';
            }
            var cellIndex = (i*9)+j;
            var gridRow = Math.floor( i / 3 );
            var gridCol = Math.floor( j / 3 );
            var gridIndex = gridRow * 3 + gridCol;



            s += '<td class="sc-'+j+' block-'+gridIndex+' ' + c + '"><input data-cell="'+cellIndex+'" class="input sudoku-input" data-row="'+i+'" data-block="'+gridIndex+'" data-col="'+j+'" type="number" autocomplete="off" spellcheck="false" size="1" maxlength="1" id="C' + (i * 9 + j) + '"></td>';
        }
        s += '</tr>\n';
    }

    s += '</table>';
    document.getElementById('9x9').innerHTML = s;
    var inp = document.URL;
    var set = false;

    if (inp.indexOf('?') >= 0) {
        var match = /[?&]puzzle=([^\s&]+)/.exec(inp);
        if (match.length == 2 && match[1].length >= 81) {
            set_9x9(match[1]);
            set = true;
        }
    }




}

function clear_input() {
    for (var i = 0; i < 81; ++i) {
        document.getElementById('C' + i).value = '';
    }
    document.getElementById('runtime').style.display = 'none';
}


function check(obj) {
    jQuery('.input').removeClass('error');
    jQuery('td').removeClass('error');
    jQuery('tr').removeClass('error');
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
    let findDuplicatesInObject = (arr) => {
      var numbers = [];
      for (var i=0;i<arr.length;i++) {
          if (arr[i].value!=='' & !isNaN(arr[i].value)) {
              numbers.push(arr[i].value);
          }
      }
      numbers = findDuplicates(numbers);
      var results = [];
      for (var i=0;i<arr.length;i++) {
          if (arr[i].value!=='' & !isNaN(arr[i].value)) {
              if (numbers.includes(arr[i].value)) {
                  results.push(arr[i]);
              }
          }
      }
      for (var cell in results) {
          jQuery(cell).addClass('big');
      }
      return(results);
    };


    var block = jQuery(obj).data('block');
    var row = jQuery(obj).data('row');
    var col = jQuery(obj).data('col');
    var rowNumbers = [];
    jQuery('.sr-'+row+' .input').each(function() {
        rowNumbers.push(this);
    });
    var colNumbers = [];
    jQuery('.sc-'+col+' .input').each(function() {
        colNumbers.push(this);
    });
    var blockNumbers = [];
    jQuery('.block-'+block+' .input').each(function() {
        blockNumbers.push(this);
    })


    jQuery('.input').removeClass('big');
    if (findDuplicatesInObject(blockNumbers).length>0) {
        jQuery('.block-'+block).addClass('error');
        jQuery(obj).addClass('error');
    }
    if (findDuplicatesInObject(colNumbers).length>0) {
        jQuery('.sc-'+col).addClass('error');
        jQuery(obj).addClass('error');
    }
    if (findDuplicatesInObject(rowNumbers).length>0) {
        jQuery('.sr-'+row).addClass('error');
        jQuery(obj).addClass('error');
    }
}

function isValidSudoku() {
    let store = {
        rows: {},
        cols: {},
        square: {},
    };
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const ci = (i*9)+j;
            const cell = document.getElementById('C'+ci);
            const box = cell.value;

            cell.style.color = '#000';
            cell.style.backgroundColor = '#fFF';

            if (!store["rows"][i] && box !== "") {
                store["rows"][i] = [];
                store["rows"][i].push(box);
            } else if (box !== "" && !store["rows"][i].includes(box)) {
                store["rows"][i].push(box);
            } else if (store["rows"][i] && store["rows"][i].includes(box)) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }

            if (!store["cols"][j] && box !== "") {
                store["cols"][j] = [];
                store["cols"][j].push(box);
            } else if (box !== "" && !store["cols"][j].includes(box)) {
                store["cols"][j].push(box);
            } else if (store["cols"][j] && store["cols"][j].includes(box)) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }

            const squareRowId = Math.ceil((i + 1) / 3);
            const squareColId = Math.ceil((j + 1) / 3);
            const squareId = `${squareRowId}-${squareColId}`;

            if (!store["square"][squareId] && box !== "") {
                store["square"][squareId] = [];
                store["square"][squareId].push(box);
            } else if (box !== "" && !store["square"][squareId].includes(box)) {
                store["square"][squareId].push(box);
            } else if (
                store["square"][squareId] &&
                store["square"][squareId].includes(box)
            ) {
                cell.style.color = '#C00';
                cell.style.backgroundColor = '#fcc';
                return false;
            }
        }
    }
    return true;
}

function unhover(obj) {
    for (var i=0;i<9;i++) {
        jQuery('.block-'+i+' .input').removeClass('hover');
        jQuery('.sr-'+i+' .input').removeClass('hover');
        jQuery('.sc-'+i+' .input').removeClass('hover');
    }
}
function hover(obj) {
    jQuery('.input').removeClass('hover');
    var block = jQuery(obj).data('block');
    var row = jQuery(obj).data('row');
    var col = jQuery(obj).data('col');

    jQuery('.block-'+block+' .input').addClass('hover');
    jQuery('.sr-'+row+'  .input').addClass('hover');
    jQuery('.sc-'+col+'  .input').addClass('hover');
}
function focus(obj) {

}


function setPredefined(lvl) {
    document.getElementById('runtime').style.display = 'none';
    switch (lvl) {
        case 'beginner':
            set_9x9('806047003901083547300900600680090300012376084009800706290760031003502060108400270');
            break;
        case 'easy':
            set_9x9('007300405000020900253064870090740360000030080836209047100802603600000018082610004');
            break;
        case 'normal':
            set_9x9('032054900090001004080700031005600027800070000270140005000210300018907652603000000');
            break;
        case 'hard':
            set_9x9('010000300000300051308146009900000000280050704000602900600400000000003107107805090');
            break;
        case 'evil':
            set_9x9('005200000400300700600000010800020100040800500000095000083040070090006080500902000');
            break;
    }
}

