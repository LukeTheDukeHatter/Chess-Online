const GPCM = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7,0:'a',1:'b',2:'c',3:'d',4:'e',5:'f',6:'g',7:'h'};

function isLocalValid(x,y) { return (x >= 0) && (x <= 7) && (y >= 1) && (y <= 8) }
function isSpotFree(id,pname) { return document.getElementById(id).hasChildNodes() === false || isOpposingPiece(id,pname) }
function isOpposingPiece(id,pname) { 
	return (
		document.getElementById(id).hasChildNodes() === true &&
		document.getElementById(id).firstChild.src.split('/').slice(-1)[0].split('.')[0][0] !== pname[0]
	)
}

function CalculateValidPoints(GRef, pname) {

    let possible = [];

    if (PieceNames[pname] === 'Pawn') {
		let fp = GRef[0];
		let sp = parseInt(GRef[1]);

		let ydir = pname[0] === 'W' ? 1 : -1;

		if (isLocalValid(GPCM[fp],sp+ydir) && document.getElementById(`${fp}${sp+ydir}`).hasChildNodes() === false) {
			possible.push(`${fp}${sp+ydir}`);
		}

		[-1,1].forEach(opt => {
			if (isLocalValid(GPCM[fp]+opt,sp+ydir) && isOpposingPiece(`${GPCM[GPCM[fp]+opt]}${sp+ydir}`,pname)) {
				possible.push(`${GPCM[GPCM[fp]+opt]}${sp+ydir}`);
			}
		})

	} else if (PieceNames[pname] === 'Knight') {
		let xnums = [-2,-1,0,1,2]; // The width of the square to check within
		let ynums = [-2,-1,0,1,2]; // The height of the square to check within

		let fp = GRef[0]; // The x grid reference of the original piece
		let sp = GRef[1]; // The y grid reference of the original piece

		xnums.forEach((x) => {
			ynums.forEach((y) => {
				let newx = (GPCM[fp]+x); // The x value of the next point we're checking
				let newy = (parseInt(sp)+y); // The y value of the next point we're checking

				let dx = Math.abs(GPCM[fp]-newx); // X distance from original
				let dy = Math.abs(parseInt(sp)-newy); // Y distance from original

				let pyth = ((dx*dx)+(dy*dy)); // Pythagorean theorem for distance from initial piece coords to new coords, Will be 5 if both dx and dy are 2 and 1, either way round

				// If the new coords are within the grid, and is the correct distance away
				if ( isLocalValid(newx,newy) && pyth === 5 ) {
					if  ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			});
		});
	
	} else if (PieceNames[pname] === 'Bishop') {

		let fp = GRef[0]; // The x grid reference of the original piece
		let sp = GRef[1]; // The y grid reference of the original piece

		let opts = [[1,1],[-1,1],[1,-1],[-1,-1]];
		let uips = [true,true,true,true];

		for (let i = 1; i < 9; i++) {

			opts.forEach((opt) => {

				let newx = (GPCM[fp]+(i*opt[0])); // The x value of the next point we're checking
				let newy = (parseInt(sp)+(i*opt[1])); // The y value of the next point we're checking
				
				if ( uips[opts.indexOf(opt)] ) {
					if ( isLocalValid(newx,newy) ) { 	
						if  ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
							possible.push(`${GPCM[newx]}${newy}`);
						} else {
							uips[opts.indexOf(opt)] = false;
						}
						if ( isOpposingPiece(`${GPCM[newx]}${newy}`,pname) ) {
							uips[opts.indexOf(opt)] = false;
						}
					}
				}	

			});
			
		}

	} else if (PieceNames[pname] === 'Rook') {
		let fp = GPCM[GRef[0]]; 
		let sp = parseInt(GRef[1]); 

		var uip; // uip Stands for Uninpaired, used to stop checking squares in a direction once a piece is found to be blocking the path

		uip = true;
		for (let x = 1; x < 9; x++) { 	// Checks all squares to the right of the piece
			let newx = fp+x;
			let newy = sp;

			if ( newx >= 0 && newx <= 7 ) { 
				if (document.getElementById(`${GPCM[newx]}${newy}`).hasChildNodes() === true) { uip = false; }
				if (uip) {
					if ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			}
		}								// End of right check
		
		uip = true;
		for (let x = -1; x > -9; x--) { 	// Checks all squares to the left of the piece
			let newx = fp+x;
			let newy = sp;

			if ( newx >= 0 && newx <= 7 ) { 
				if (document.getElementById(`${GPCM[newx]}${newy}`).hasChildNodes() === true) { uip = false; }
				if (uip) {
					if ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			}
		} 								// End of left check
		
		uip = true;
		for (let y = 1; y < 9; y++) { 	// Checks all squares above the piece
			let newx = fp;
			let newy = sp+y;
			
			if ( newy >= 1 && newy <= 8 ) {
				if (document.getElementById(`${GPCM[newx]}${newy}`).hasChildNodes() === true) { uip = false; }
				if (uip) {
					if ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			}
		}								// End of up check
		
		uip = true;
		for (let y = -1; y > -9; y--) { 	// Checks all squares below the piece
			let newx = fp;
			let newy = sp+y;
			
			if ( newy >= 1 && newy <= 8 ) { 
				if (document.getElementById(`${GPCM[newx]}${newy}`).hasChildNodes() === true) { uip = false; }
				if (uip) {
					if ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			}
		} // End of down check

	} else if (PieceNames[pname] === 'Queen') {
		
		let fp = GRef[0]; // The x grid reference of the original piece
		let sp = GRef[1]; // The y grid reference of the original piece

		let opts = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
		let uips = [true,true,true,true,true,true,true,true];


		for (let i = 1; i < 9; i++) {

			opts.forEach((opt) => {

				let newx = (GPCM[fp]+(i*opt[0])); // The x value of the next point we're checking
				let newy = (parseInt(sp)+(i*opt[1])); // The y value of the next point we're checking
				
				if ( uips[opts.indexOf(opt)] ) {
					if ( isLocalValid(newx,newy) ) { 	
						if  ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
							possible.push(`${GPCM[newx]}${newy}`);
						} else {
							uips[opts.indexOf(opt)] = false;
						}
						if ( isOpposingPiece(`${GPCM[newx]}${newy}`,pname) ) {
							uips[opts.indexOf(opt)] = false;
						}
					}
				}

			});

		}

	} else if (PieceNames[pname] === 'King') {
		let xnums = [-1,0,1];
		let ynums = [-1,0,1];

		let fp = GRef[0];
		let sp = GRef[1];

		xnums.forEach(function (x) {
			ynums.forEach(function (y) {
				let newx = (GPCM[fp] + x);
				let newy = parseInt(sp) + y;
				if ( isLocalValid(newx,newy) ) { 
					if  ( isSpotFree(`${GPCM[newx]}${newy}`,pname) )  {
						possible.push(`${GPCM[newx]}${newy}`);
					}
				}
			});
		});
	}

    return possible;

}