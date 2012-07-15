/*------------------------------   VARIABLES   ------------------------------*/
//DOMAINS
var roofDomain = DOMAIN([[0,1],[0,1]])([6,6]);


// COLORS
var DARK_WOOD = [133/255,94/255,66/255];
var GLASS = [0.64, 0.83, 0.93, 0.7];
var MARBLE = [250/255,250/255,250/255];
var BURLY_WOODS = [139/255,119/255,101/255];
var ROOF = 	[0.8,0.51,0.4];
var WHITE_TIMPANO = 	[1,0.94,0.86];
//var MARBLE = [230/255,228/255,216/255];


//-------------------------------------------------------------------------------

// STAIRS
wStep = 13;
hStep = 0.25;
tStep = 0.6;
d = 2*tStep; // distanza tra gruppi di stairs
numberOfSteps = 3;
heightSteps = numberOfSteps*hStep;
tSteps = tStep*numberOfSteps;
p0 = [0,0,0];

lFS = heightSteps+hStep; // width fianco scala
aFS = 4*heightSteps+hStep  // height fianco scala

stairsTotalWidth = 2*lFS + wStep;
tStairs = 4*(tSteps+d)+tStep;
hStairs = 4*heightSteps+hStep;


//-------------------------------------------------------------------------------

// COLONNADE
var colonnadeDepth = 6;
var colonnadeWidth = 15;

var upperColumnBase = 1;

//-------------------------------------------------------------------------------
// WALLS
/*
e: external, c: central, b: back
m: medium, l: low
*/

// heights
var lWallHeight = hStairs; 		// circa 3
var mWallHeight = 7;
var hWallHeight = 7;
var totalWallHeight = lWallHeight + mWallHeight + hWallHeight;

// wall thickness
var wallsThickness = 1;

//widths
var eW = cW = 11;
var b1WallWidth = b2WallWidth = 7;

// depths
var eD = cD = b1 = 7;
var b2D = 9;


// others
var leftSideWidth = wallsThickness + cW + 6;

//-------------------------------------------------------------------------------

// WINDOWS
var windowWidth = 1.5;
var	windowThickness = 0.1;
var littleWindowHeight = lWallHeight/3;
var bigWindowHeight = totalWallHeight*3/18;
var sideHighWindowHeight = totalWallHeight*2/18;
var rearSmallerHighWindowHeight = mWallHeight/8;
var rearBiggerHighWindowHeight = hWallHeight/4;
var rearBiggerMediumWindowHeight = mWallHeight/4;


//-------------------------------------------------------------------------------


// FRAMES
var blindThickness = 0.05;
var blindHeight = 0.1;


//-------------------------------------------------------------------------------

// FRONTDOOR
var doorWidth = 3.25;
var doorHeight = 5.625;
var doorThickness = 0.25;

var mediumWindowHeight = lWallHeight*3/4;

//-------------------------------------------------------------------------------

// ROOF

// Central roof
var timpanoWidth = stairsTotalWidth;
var roofDepth = 3*wallsThickness+7+7+10 + colonnadeDepth;
var timpanoHeight = 3;
var dTettoFrontone = 0.1;  // distanza tra parte di tetto che esce e timpano

// Horizontal Roof
var dX = 8; // distanza tra vertici in basso a sinistra del tetto orizzontale e quello perpendicolare
var dY = colonnadeDepth;
var dZ = 2;  // differenza altezze tetti
var sporgenza = 0.2; // distanza tra muro su asse x e tetto che sporge
var horizontalRoofWidth_half = dX + timpanoWidth/2;
var horizontalRoofDepth = 7+12+2*wallsThickness + 2*sporgenza + 6;
var horizontalRoofHeight = timpanoHeight+dZ;
var parteDrittaWidth = 6;

//-------------------------------------------------------------------------------

/* ------------------------------------------ UTILS ------------------------------------------*/
var drawAll = function(array) {
	array.map(function(a){DRAW(a);});
};


var duplicate = function(leftHalf) {
	var rightHalf = T([0])([2*(leftSideWidth ) + stairsTotalWidth])( S([0])([-1])(leftHalf) );
	var entire = STRUCT([leftHalf,rightHalf]);
	return entire;
}

/* ------------------------------------------ STAIRS ------------------------------------------*/

/*
build a single step
vertexDL: vertex in basso a sinistra del rettangolo
*/
var buildStep = function(vertexDL,width,height,thickness) {
 	var x = vertexDL[0];
	var y = vertexDL[1];
	var z = vertexDL[2];

	return SIMPLEX_GRID( [ [-x,width], [-y,thickness], [-z,height] ] );
 }; 

/*
funzione che costruisce una scala
n: numberOf di steps
p1: 
*/
var buildStairs = function(p1,n,width,height,thickness) {
	var steps = [];
	var j = 1;

	for (i=0; i<n; i++) {
		var pX = p1[0];
		var pY = p1[1] + thickness*(i);
		var pZ = p1[2];

		var p = [pX, pY, pZ];

		var step = buildStep(p,width,height*j,thickness);
		steps.push(step);

		j++;
	}

	return STRUCT( steps );
}

var build2FlightOfSteps = function() {
	var builtFlightOfStep = buildFlightOfSteps()
	var builtFlightOfStepBack = R([0,1])([PI])(builtFlightOfStep);
	builtFlightOfStepBack.translate([0,1],[(leftSideWidth+2*stairsTotalWidth+3*lFS),-colonnadeDepth+4*wallsThickness+7+7+9]);
	var builtFlightsOfSteps = STRUCT([builtFlightOfStep,builtFlightOfStepBack]);
	DRAW(builtFlightsOfSteps);
};

var buildFlightOfSteps = function() {
	// BUILD STEPS
	var singleStep = buildStep(p0, wStep, hStep, tStep + d);
	var base0_1 = SIMPLEX_GRID([[wStep],[-tStep-d,tSteps],[hStep]]);
	var p1 = [p0[0],tStep+d,hStep];
	var base1_2 = SIMPLEX_GRID([ [wStep], [-p1[1]-tSteps,d+tSteps], [p1[2]+heightSteps] ]);
	var p2 = [p1[0], p1[1]+d+tSteps, p1[2]+hStep*3];
	var base2_3 = SIMPLEX_GRID([ [wStep], [-p2[1]-tSteps,d+tSteps], [p2[2]+heightSteps] ]);
	var p3 = [p2[0], p2[1]+d+tSteps, p2[2]+hStep*3];
	var base3_4 = SIMPLEX_GRID([ [wStep], [-p3[1]-tSteps,d+tSteps], [p3[2]+heightSteps] ]);
	var p4 = [p3[0], p3[1]+d+tSteps, p3[2]+heightSteps];

	var stairs1 = buildStairs(p1,3,wStep,hStep,tStep);
	var stairs2 = buildStairs(p2,3,wStep,hStep,tStep);
	var stairs3 = buildStairs(p3,3,wStep,hStep,tStep);
	var stairs4 = buildStairs(p4,3,wStep,hStep,tStep);
	var stairs = STRUCT([singleStep,stairs1,stairs2,stairs3,stairs4,base3_4,base2_3,base1_2,base0_1]);


	// BUILD STAIRS SIDE SUPPORT
	var pSideFS = [ p0, [p0[0],lFS,p0[2]], [p0[0],p4[1]+tSteps,p4[0]], [p0[0],p4[1]+tSteps,aFS],
				[p0[0],p3[1], aFS], [p0[0],lFS,lFS], [p0[0],p0[1],lFS], [p0[0],lFS,p0[2]] ];  // punti fianco scala
	var cellsSideFS = [[1,2,3,4],[1,4,5,7], [0,7,5,6]];

	var pBaseFS = pSideFS.map(function(v) {return [v[0]+lFS,v[1],v[2]]} );
	var pFS = pSideFS.concat(pBaseFS);

	var cellsBaseFS = [[0,2,10,8],[2,10,3,11],[3,11,4,12],[4,12,5,13],[5,13,6,14], [6,14,0,8]];


	var fiancoStairSx1 = SIMPLICIAL_COMPLEX(pSideFS)(cellsSideFS);
	var fiancoStairSx2 = T([0])([lFS])(fiancoStairSx1);
	var fiancoStairSx = STRUCT([ fiancoStairSx1, fiancoStairSx2, SIMPLICIAL_COMPLEX(pFS)(cellsBaseFS) ]);
	var fiancoStairDx = T([0])([wStep+lFS])(fiancoStairSx);
	var fiancoStair = STRUCT([fiancoStairDx,fiancoStairSx]);

	stairs = T([0])([lFS])(stairs);
	stairs = STRUCT([stairs,fiancoStair]);
	stairs = T([0,1])([leftSideWidth,-tStairs-colonnadeDepth])(stairs);

	return stairs;
};


/* ------------------------------------------ COLONNADE ------------------------------------------*/

var buildColonnade = function() {
	buildColumns();
	buildArchs();

	var baseColonnade = SIMPLEX_GRID([[colonnadeWidth],[-tStairs,colonnadeDepth],[hStairs]]);
	baseColonnade = T([0,1])([leftSideWidth,-tStairs-colonnadeDepth])(baseColonnade);
	DRAW(baseColonnade);
};

var buildColumns = function() {
	var c1 = buildColumn();
	/*
	var c2 = T([0])([])(c1);
	...

	var columns = STRUCT([c1,c2,..]);
	DRAW(columns);
	*/
}

var buildColumn = function() {
	/*var capital = buildCapital();
	var body = 

	var column = STRUCT([capital]);
	return column;*/
}

var buildCapital = function() {

}

var buildArchs = function(){
  var basamento1 = CUBOID([4,1,0.28]);
  var basamento_sottoarch = T([0,1,2])([0,0.07,0.279999])(CUBOID([3.93,0.73,0.76]));
  var pilastro_arch1 = T([0,1,2])([3.18,0.07,1.039999])(CUBOID([0.75,0.73,3.44]));
  var pilastro_arch2 = T([0,1,2])([0,0.07,1.039999])(CUBOID([0.75,0.73,3.44]));
  var anello1 = T([0,1,2])([3.08,-0.03,4.479999])(CUBOID([0.93,0.91,0.26]));
  var anello2 = T([0,1,2])([-0.10,-0.03,4.479999])(CUBOID([0.93,0.91,0.26]));
 

  var curvePart = buildCurveArchPart().translate([1,2],[0.07,4.74]);
  var leftArch = COLOR(beige_mura)(STRUCT([basamento1, basamento_sottoarch, pilastro_arch1, pilastro_arch2, anello1, anello2, curvePart]));

  var archSf = 1.15;
  leftArch = S([0,1,2])([archSf,archSf,archSf])(leftArch);
  leftArch = R([0,1])([-PI/2])(leftArch).translate([0,2],[11+6+wallsThickness,hStairs]);
  
  var arches = duplicate(leftArch);

  DRAW(arches);
  return arches;
}

var buildCurveArchPart = function() {
	var p_arch_ext = [[0,0,0],[0.74,0,0],[0.75,0,0],[0.9525,0,1],[1.42875,0,1.8],[2.025,0,2],[2.50125,0,1.8],[2.9775,0,1],[3.18,0,0],[3.07,0,0],[3.93,0,0]];
    var p_arch_int = p_arch_ext.map(function (p){ return [p[0],p[1]+0.73,p[2]]});

    var c_arch_ext = nubsS0(p_arch_ext);
    var c_arch_int = nubsS0(p_arch_int);

    var p_arch_lato_sx_ext = [[0,0,0],[0,0,2],[0,0,2.29]]
    var p_arch_lato_dx_ext = p_arch_lato_sx_ext.map(function (p){ return [p[0]+3.93,p[1],p[2]]});
    
    var p_arch_lato_sx_int = p_arch_lato_sx_ext.map(function (p){ return [p[0],p[1]+0.73,p[2]]});
    var p_arch_lato_dx_int = p_arch_lato_sx_ext.map(function (p){ return [p[0]+3.93,p[1]+0.73,p[2]]});

    var c_arch_lato_sx_ext = nubsS0(p_arch_lato_sx_ext);
    var c_arch_lato_dx_ext = nubsS0(p_arch_lato_dx_ext);
    var c_arch_lato_sx_int = nubsS0(p_arch_lato_sx_int);
    var c_arch_lato_dx_int = nubsS0(p_arch_lato_dx_int);

    var p_arch_chiusura_ext = [[0,0,2.29],[2,0,2.29],[3.93,0,2.29]];
    var p_arch_chiusura_int = p_arch_chiusura_ext.map(function (p){ return [p[0],p[1]+0.73,p[2]]});

    var c_arch_chiusura_ext = nubsS0(p_arch_chiusura_ext);
    var c_arch_chiusura_int = nubsS0(p_arch_chiusura_int);

    var chiusura_ext = hermiteS1(c_arch_chiusura_ext,c_arch_ext, [0,0,0], [0,0,0]);
    var chiusura_int = hermiteS1(c_arch_chiusura_int, c_arch_int, [0,0,0], [0,0,0]);
    var chiusura_sup = hermiteS1(c_arch_chiusura_ext,c_arch_chiusura_int, [0,0,0], [0,0,0])
    var bordo_arch_sx = hermiteS1(c_arch_lato_sx_ext,c_arch_lato_sx_int, [0,0,0], [0,0,0]);
    var bordo_arch_dx = hermiteS1(c_arch_lato_dx_ext,c_arch_lato_dx_int, [0,0,0], [0,0,0]);
    var arch_semicirc = hermiteS1(c_arch_int, c_arch_ext, [0,0,0], [0,0,0]);
    
    var arch = STRUCT([bordo_arch_sx,bordo_arch_dx,arch_semicirc,chiusura_ext,chiusura_int,chiusura_sup]);
    return arch;
}

/* ------------------------------------------ FRAMES ------------------------------------------*/


var buildFrames = function() {
	// DRAW 
	buildDoors();
	buildWindows();
	applyBoundaries();
	
}

var applyBoundaries = function(){
	// FINESTRE APERTE
	var a = applyBoundaryWood([0.5,0,lWallHeight/3],lWallHeight/3);

	//FINESTRE CHIUSE

	//PORTE


	DRAW(a);
}

/* ------------------------------------------ DOORS ------------------------------------------*/

var buildDoors = function() {
	buildFrontdoors();
	buildBackdoor();
	buildGenericDoors();
}

var buildFrontdoors = function() {
	var fd = buildDoor();
	fd.translate([1],[wallsThickness/2]);

	var fdUp = T([2])([mWallHeight])(fd);

	drawAll([fd,fdUp]);
}

var buildBackdoor = function() {
	var bd = buildDoor();
	bd.translate([1],[-doorThickness+4*wallsThickness+7+7+9-colonnadeDepth +wallsThickness/2]);
	DRAW(bd);
}


var buildDoor = function() {
	var sf = 0.125; // scale factor
	var thickness = doorThickness/sf;
	var height = doorHeight/sf;
	var width = doorWidth/sf;

	//horizontal wood parts
	var lowPart = SIMPLEX_GRID([[width],[thickness],[7]]);
	var highPart = SIMPLEX_GRID([[width],[thickness],[-(height-2),2]]);
	var middlePart1 = SIMPLEX_GRID([ [-6,14], [thickness], [-(height-7),2] ]);
	var middlePart2 = SIMPLEX_GRID([ [-2,width-2], [thickness], [-27,2] ]);

	//vertical wood parts
	var boundarySx = SIMPLEX_GRID([[2],[thickness],[-7,45-7]]);
	var boundaryDx = T([0])([24])(boundarySx);
	var vMiddlePart1 = SIMPLEX_GRID([[-4,2],[thickness],[-27,16]]);
	var vMiddlePart2 = T([0])([16])(vMiddlePart1);
	var vMiddlePart11 = SIMPLEX_GRID([[-4,2],[thickness],[-7,20]]);
	var vMiddlePart22 = T([0])([16])(vMiddlePart11);
	var vCentralPart =  SIMPLEX_GRID([[-12,2],[thickness],[-7,20]]);

	// rods
	var rod1 = SIMPLEX_GRID([[-2,2],[thickness],[-35.8,0.4]]);
	var rod2 = T([0])([20])(rod1);
	var rod3 = SIMPLEX_GRID([[-6,14],[thickness],[-33.3,0.4]]);
	var rod4 = SIMPLEX_GRID([[-10.4,0.4],[thickness],[-40,3]]);
	var rod5 = T([0])([4.4])(rod4);
	var rod6 = SIMPLEX_GRID([[-9.2,0.4],[thickness],[-29,4.48]]);
	var rod7 = T([0])([3.4])(rod6);
	var rod8 = T([0])([3.4])(rod7);
	var rod9 = T([2])([4.9])(rod6);
	var rod10 = T([2])([4.9])(rod7);
	var rod11 = T([2])([4.9])(rod8);
	var rod12 = SIMPLEX_GRID([[-7.7,0.4],[thickness],[-7,20]]);
	var rod13 = T([0])([1.8])(rod12);
	var rod14 = SIMPLEX_GRID([[-15.7,0.4],[thickness],[-7,20]]);
	var rod15 = T([0])([1.8])(rod14);
	var rod16 = SIMPLEX_GRID([[-6,14],[thickness],[-11.5,0.4]]);
	var rod17 = T([2])([9.8])(rod16);
	var rod18 = SIMPLEX_GRID([[-2,22],[thickness],[-16.8,0.4]]);
	var rods = STRUCT([rod1,rod2,rod3,rod4,rod5,rod6,rod7,rod8,rod9,rod10,rod11,rod12,rod13,rod14,rod15,rod16,rod17,rod18]);

	var woodFDParts = STRUCT([lowPart,boundarySx,boundaryDx,highPart,middlePart1,middlePart2,vMiddlePart1,vMiddlePart2,vMiddlePart11,vMiddlePart22,vCentralPart,rods]);

	woodFDParts = COLOR(DARK_WOOD)(woodFDParts);


	var FDGlasses = SIMPLEX_GRID([ [-2,22],[-thickness/2,0.01],[-7,0.1,36] ]);
	FDGlasses = COLOR(GLASS)(FDGlasses);

	frontDoor = STRUCT([woodFDParts, FDGlasses]);

	var sf = 0.125; 	//scale factor	
	frontDoor.scale([0,1,2],[sf,sf,sf]);
	frontDoor.translate([0,2],[leftSideWidth + lFS + (wStep)/2 - width*sf/2, hStairs]);
	

	return frontDoor;
};

var buildGenericDoor = function (p,height,side) {
	if(!side) {
		var door = SIMPLEX_GRID([[-p[0],windowWidth],[-p[1],windowThickness],[-p[2],height]]);
	}
	else {
		var door = SIMPLEX_GRID([[-p[0],windowThickness],[-p[1]+windowWidth,windowWidth],[-p[2],height]]);
	}
	return door;
}

var buildGenericDoors = function() {
	var dFrontLeft = buildGenericDoor([0.5+ windowWidth+4.5,wallsThickness/2,0],mediumWindowHeight);

	var dSideExternalRight = buildGenericDoor([wallsThickness/2,wallsThickness +0.5 +windowWidth,0],mediumWindowHeight,true).translate([0],[-1]);
	
	var leftDoors = STRUCT([dSideExternalRight,dFrontLeft]);
	var doors = duplicate(leftDoors);
	doors = COLOR(DARK_WOOD)(doors);
	DRAW(doors);
	return doors;
}


/* ------------------------------------------ WINDOWS ------------------------------------------*/


var buildWindows = function() {
	var littleWindows = buildLittleWindows();
	var bigWindows = buildBigWindows();
	var sideHighWindows = buildSideHighWindows();
	var rearWindows = buildRearWindows();

	var leftWindows = STRUCT([littleWindows,bigWindows,sideHighWindows,rearWindows]);
	var rightWindows = S([0])([-1])(leftWindows).translate([0],[11*2+6+3+windowWidth*2+wallsThickness*2+stairsTotalWidth]) ;
	var windows = STRUCT([leftWindows,rightWindows]);
	windows = COLOR(GLASS)(windows);
	DRAW(windows);
}

/*
p: vertex low left
side: true if window width is on y axis
*/
var buildGenericWindow = function (p,height,side) {
	if(!side) {
		var window = SIMPLEX_GRID([[-p[0],windowWidth],[-p[1],windowThickness],[-p[2],height]]);
	}
	else {
		var window = SIMPLEX_GRID([[-p[0],windowThickness],[-p[1]+windowWidth,windowWidth],[-p[2],height]]);
	}
	return window;
}

var buildLittleWindows = function() {

	var wFrontLeft = buildGenericWindow([0.5,0,littleWindowHeight],littleWindowHeight);
	var wFrontRight = T([0])([windowWidth+4.5+windowWidth+3+wallsThickness+1.5])(wFrontLeft);
	var wSideExternalLeft = buildGenericWindow([0,wallsThickness+ 7 -0.5 ,littleWindowHeight],littleWindowHeight,true).translate([0],[-1]);
	var wBackLow = T([0,1])([0.75,7+7+9+ 4*wallsThickness -windowThickness])(wFrontRight);

	var littleWindows = STRUCT([wFrontLeft,wFrontRight,wSideExternalLeft,wBackLow]);

	return littleWindows;
}

var buildRearWindows = function() {
	var littleBackHigh = buildGenericWindow([11+wallsThickness+2.25,
										7+7+9+ 4*wallsThickness -windowThickness,
										lWallHeight+ mWallHeight*13/16],    rearSmallerHighWindowHeight );
	var bigBackMedium = buildGenericWindow([11+wallsThickness+2.25,
										7+7+9+ 4*wallsThickness -windowThickness,
										lWallHeight+ mWallHeight/4],    rearBiggerMediumWindowHeight );
	var bigBackHigh = buildGenericWindow([11+wallsThickness+2.25,
										7+7+9+ 4*wallsThickness -windowThickness,
										lWallHeight+ mWallHeight + hWallHeight*3/8],    rearBiggerHighWindowHeight );
	
	var rearWindows = STRUCT([littleBackHigh, bigBackMedium, bigBackHigh,]);
	return rearWindows;
}


var buildSideHighWindows = function() {
	var wSideHighRight = buildGenericWindow([11, wallsThickness +7 +wallsThickness +0.5 + windowWidth ,totalWallHeight/18+ 2*(totalWallHeight*4/18 + bigWindowHeight)],
											sideHighWindowHeight ,true);
	var wSideHighCenterRight = T([1])([windowWidth +3])(wSideHighRight);
	var wSideHighCenterLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth ])(wSideHighRight);
	var wSideHighLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth + 3 +windowWidth ])(wSideHighRight);

	var sideHighWindows = STRUCT([wSideHighRight,wSideHighCenterRight,wSideHighCenterLeft,wSideHighLeft]);
	return sideHighWindows;
}


var buildBigWindows = function () {
	var wSideLowRight = buildGenericWindow([11,wallsThickness +7 +wallsThickness +0.5 + windowWidth ,totalWallHeight/18],bigWindowHeight ,true);
	var wSideLowCenterRight = T([1])([windowWidth +3])(wSideLowRight);
	var wSideLowCenterLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth ])(wSideLowRight);
	var wSideLowLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth + 3 +windowWidth ])(wSideLowRight);
	
	var wSideMediumRight = T([2])([totalWallHeight*4/18 + bigWindowHeight])(wSideLowRight);
	var wSideMediumCenterRight = T([1])([windowWidth +3])(wSideMediumRight);
	var wSideMediumCenterLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth ])(wSideMediumRight);
	var wSideMediumLeft = T([1])([windowWidth +3 +windowWidth +1.5 +windowWidth + 3 +windowWidth ])(wSideMediumRight);

	
	var bigWindows = STRUCT([wSideLowRight,wSideLowCenterRight,wSideLowCenterLeft,wSideLowLeft,
							 wSideMediumRight,wSideMediumCenterRight,wSideMediumCenterLeft,wSideMediumLeft]);
	return bigWindows;
}

/* 
lbV: left bottom vertex
side: true if window width on x axis
*/

var applyBoundaryWood = function(lbV,windowHeight,side) {
	if (!side) {
		var bottomWood = SIMPLEX_GRID([[windowWidth],[blindThickness],[blindHeight]]);	
		var sideWoodLeft = SIMPLEX_GRID([[blindThickness],[blindThickness],[-blindHeight,windowHeight-2*blindThickness]]);	
		var sideWoodRight = T([0])([windowWidth-blindThickness])(sideWoodLeft);
		var topWood = T([2])([windowHeight -blindThickness])(bottomWood);
	}
	else {

	}
	
	var blind = STRUCT([bottomWood,sideWoodLeft,sideWoodRight,topWood]).translate([0,1,2],[lbV[0],lbV[1]-blindThickness,lbV[2]]);
	blind = COLOR(DARK_WOOD)(blind);

	return blind;
}



/* ------------------------------------------ WALLS ------------------------------------------*/

var buildWalls = function() {

	// BUILD LEFT HALF of the building walls
	var frontWalls = buildFrontWalls();
	var sideWalls = buildSideWalls();
	var backWalls = buildBackWalls();
	var internalWalls = buildInternalWalls();


	//BUILD THE ENTIRE BUILDING WALLS
	var leftHalfBuild = STRUCT([frontWalls,sideWalls,backWalls,internalWalls]);

	var walls = duplicate(leftHalfBuild);


	DRAW(walls);
};


var buildWall = function(p,width,depth,height) {
	return SIMPLEX_GRID([[-p[0],width],[-p[1],depth],[-p[2],height]])
};

var buildFrontWalls = function() {
	// FRONT WALLS
	var lwFront1 = SIMPLEX_GRID([[0.5,-windowWidth,4.5,-windowWidth,1],[wallsThickness],[lWallHeight]]);
	var lwFront2_1 = SIMPLEX_GRID([[-0.5,windowWidth],
								 [wallsThickness],
								 [lWallHeight/3,-lWallHeight/3,lWallHeight/3]]);
	var lwFront2_2 = SIMPLEX_GRID([[-(0.5+windowWidth+4.5),windowWidth],
								 [wallsThickness],
								 [-lWallHeight*3/4,lWallHeight/4]]);

	var lwFront3_1 = SIMPLEX_GRID([[-(0.5+windowWidth+4.5+windowWidth+1),2+wallsThickness+1.5,-windowWidth,3],
								 [wallsThickness],
								 [lWallHeight]]);
	var lwFront3_2 = SIMPLEX_GRID([[-(0.5+windowWidth+4.5+windowWidth+1)-2-wallsThickness-1.5,windowWidth],
								 [wallsThickness],
								 [lWallHeight/3,-lWallHeight/3,lWallHeight/3]]);
	
	var lowWalls = STRUCT([lwFront1,lwFront2_1,lwFront2_2,lwFront3_2,lwFront3_1]);
	lowWalls = COLOR(BURLY_WOODS)(lowWalls);

	var mwFront1 = SIMPLEX_GRID([[0.5,-windowWidth,4.5,-windowWidth,1],[wallsThickness],[-lWallHeight,mWallHeight]]);
	var mwFront2_1 = SIMPLEX_GRID([[-0.5,windowWidth],
								 [wallsThickness],
								 [-lWallHeight,mWallHeight/8,-mWallHeight/2,mWallHeight*3/8]]);
	var mwFront2_3 = T([0])([4.5+windowWidth])(mwFront2_1);
	var mwFront2_4 = T([0])([5.5+windowWidth])(mwFront2_3);
	var mwFront3 = SIMPLEX_GRID([[-(leftSideWidth-3),3],
								 [wallsThickness],
								 [-lWallHeight,mWallHeight]]);
	var mwFront4 = SIMPLEX_GRID([[-(0.5+windowWidth+4.5+windowWidth+2.5),0.5+wallsThickness+1.5],
								 [wallsThickness],
								 [-lWallHeight,mWallHeight]]);
	var mwFront5 = SIMPLEX_GRID([[-(0.5+windowWidth+4.5+windowWidth+1),windowWidth],
								 [wallsThickness],
								 [-lWallHeight,mWallHeight*3/8,-mWallHeight/8,mWallHeight*2/8,-mWallHeight/8,mWallHeight/8]]);


	var dist = wallsThickness+0.5; // distanza tra inizio muro centrale con scalinate e prima finestra 
	var mwFrontCentral1 = T([0])([windowWidth+3+dist])(mwFront2_4);
	var mwFrontCentral2 = SIMPLEX_GRID([[-leftSideWidth,dist,-windowWidth,(5.875-dist-windowWidth)],[wallsThickness],[-lWallHeight,mWallHeight]]);
	var mwFrontCentral3 = SIMPLEX_GRID([[-leftSideWidth-(stairsTotalWidth/2-doorWidth/2),doorWidth/2],
										[wallsThickness],
										[-lWallHeight-doorHeight,(mWallHeight-doorHeight)]]);
	var lwFrontCentral = SIMPLEX_GRID([[-leftSideWidth,stairsTotalWidth/2],[wallsThickness],[lWallHeight]]);
	var frontCentral = STRUCT([mwFrontCentral1, mwFrontCentral2, mwFrontCentral3, lwFrontCentral]);

	var highWall1 = T([2])([mWallHeight])(frontCentral);
	var highWall2 = T([2])([mWallHeight])(STRUCT([mwFront3,mwFront2_4,mwFront4]));
	var highWalls = STRUCT([highWall1,highWall2]);

	var frontWalls = STRUCT([mwFront1,mwFront2_1,mwFront2_3,mwFront2_4,mwFront3,mwFront4,mwFront5,frontCentral,lowWalls,highWalls]);

	return frontWalls;
}


var buildSideWalls = function() {
	var sideWallSmallWindowHeight = [lWallHeight/3,-lWallHeight/3,lWallHeight/3+mWallHeight/8,-mWallHeight/2,mWallHeight*3/8];
	var sideWallBigWindowHeight = [-lWallHeight*3/4,lWallHeight/4+mWallHeight/8,-mWallHeight/2,mWallHeight*3/8];

	var sideWallExternal1 = buildWall([0,0,0],wallsThickness,wallsThickness+0.5,lWallHeight+mWallHeight);
	var sideWallExternalWindow1 = SIMPLEX_GRID([[wallsThickness],[-wallsThickness-0.5,windowWidth],sideWallBigWindowHeight]);
	var sideWallExternal2 = buildWall([0,wallsThickness+0.5+windowWidth,0],wallsThickness,3,lWallHeight+mWallHeight);
	var sideWallExternalWindow2 = SIMPLEX_GRID([[wallsThickness],[-wallsThickness -0.5 -windowWidth -3, windowWidth],sideWallSmallWindowHeight]);
	var sideWallExternal3 = buildWall([0,wallsThickness+0.5+windowWidth+3+windowWidth,0],wallsThickness,0.5+wallsThickness,lWallHeight+mWallHeight);


	var sideWallExternal = STRUCT([sideWallExternal1,sideWallExternalWindow1,sideWallExternal2,sideWallExternalWindow2,sideWallExternal3]);
	sideWallExternal.translate([0],[-1]);

	var rearSideWall = SIMPLEX_GRID([ [11+wallsThickness+3],[-8,wallsThickness],[lWallHeight+mWallHeight] ]);

	var sideWallB1 = SIMPLEX_GRID([ [-11,+wallsThickness],
									  [-wallsThickness-7-wallsThickness, 0.5, -windowWidth, 3, -windowWidth, 1.5],
									  [lWallHeight+mWallHeight+hWallHeight] ]);
	var sideWallB1_window1 = SIMPLEX_GRID([ [-11,+wallsThickness],
									  		[-wallsThickness-7-wallsThickness -0.5, windowWidth, -3, windowWidth],
											[totalWallHeight/18, -totalWallHeight*3/18, totalWallHeight*4/18,
										   		-totalWallHeight*3/18, totalWallHeight*4/18, 
										  		-totalWallHeight*2/18, totalWallHeight*1/18 ]]);
	var sideWallB1_window2 = T([1])([3+windowWidth])(sideWallB1_window1);
	var sideWallB1_window3 = T([1])([3+windowWidth])(sideWallB1_window2);

	var sideWallB1_windows = STRUCT([sideWallB1_window1 , sideWallB1_window2, sideWallB1_window3]); 
	var sideWallB2 = T([1])([0.5 + windowWidth + 3 +windowWidth + 1.5 +1])(sideWallB1);
	var sideWallB12 = SIMPLEX_GRID([ [-11,+wallsThickness],
									 [-wallsThickness-7-wallsThickness -0.5-windowWidth-3-windowWidth-1.5, 1],
									 [lWallHeight+mWallHeight+hWallHeight] ]);

	var sideWallB1_B2 = STRUCT([sideWallB1,sideWallB2,sideWallB12,sideWallB1_windows]);

	var sideWall = STRUCT([rearSideWall,sideWallExternal,sideWallB1_B2]);

	return sideWall;
}

var buildBackWalls = function() {
	// BACK WALLS
	var backWall1 = buildWall([11,3*wallsThickness+7+9+7,0], wallsThickness+2.25, wallsThickness, totalWallHeight);
	var backWall2 = buildWall([11+wallsThickness+2.25+windowWidth,3*wallsThickness+7+9+7 ,0], wallsThickness+2.25, wallsThickness, totalWallHeight);
	var backWallWindow1 = SIMPLEX_GRID([[-11-wallsThickness-2.25,windowWidth],
								 [-(3*wallsThickness+7+9+7),wallsThickness],
								 [lWallHeight/3,-lWallHeight/3,lWallHeight/3+mWallHeight/4,
								  -mWallHeight/4,mWallHeight/4+mWallHeight/16,-mWallHeight/8,mWallHeight/16
								  +hWallHeight*3/8,-hWallHeight*2/8,hWallHeight*3/8]]);
	
	var backWallInside = SIMPLEX_GRID([[-11 -wallsThickness -6, wallsThickness], 
									   [-wallsThickness -7 -wallsThickness, 5, -1, 7.5, -2, 1.5],[totalWallHeight]]);
	var backWallCentral = SIMPLEX_GRID([[-11 -wallsThickness -6 -wallsThickness, 4.875], 
									   [-wallsThickness -7 -wallsThickness -7 -wallsThickness -4, wallsThickness],[totalWallHeight]]);

	var backWalls = STRUCT([backWall1,backWall2,backWallWindow1,backWallInside,backWallCentral]);

	return backWalls;
}

var buildInternalWalls = function() {
	var internalWall1 = SIMPLEX_GRID([[-11 -wallsThickness -11 +1, wallsThickness],[-wallsThickness, 3, -1, 3], [totalWallHeight]]);
	var internalWall2 = SIMPLEX_GRID([[-11 -wallsThickness -3 -1, 7],[-wallsThickness -7,wallsThickness], [totalWallHeight]]);
	var internalWallMiddle = SIMPLEX_GRID([[-11, wallsThickness +3],[-wallsThickness -7,wallsThickness], [-lWallHeight -mWallHeight, hWallHeight]]);
	var internalWalls = STRUCT([internalWall1,internalWall2,internalWallMiddle]);

	return internalWalls;
}



/*-----------------------------------------------   ROOF   --------------------------------------------------------------*/

var buildRoofs = function() {
	var cRoof = buildCentralRoof();
	var hRoof = buildHorizontalRoof();

	var leftRoof = STRUCT([cRoof,hRoof]).translate([0,2],[6+11+wallsThickness,totalWallHeight]);
	var roof = duplicate(leftRoof);
	DRAW(roof);
}

var buildCentralRoof = function() {
	// control points pezzo diagonale
	var cpDiagonalFront = [[0,0,0],[timpanoWidth/2,0,timpanoHeight]];
	var cpDiagonalBack = cpDiagonalFront.map(function(p){return [p[0],p[1]+roofDepth,p[2]]});
	//Superficie del tetto
	var roof1Surface = MAP(BEZIER(S1)([BEZIER(S0)(cpDiagonalFront), BEZIER(S0)(cpDiagonalBack)]))(roofDomain);
	roof1Surface = COLOR(ROOF)(roof1Surface);

	//control points timpano
	var cpDiagonalTimpano = cpDiagonalFront.map(function(p){return [p[0],p[1]+dTettoFrontone,p[2]]});
	var vertexLowRightTimpano = [[timpanoWidth/2,dTettoFrontone,0]];
	//Superficie del timpano
	var timpanoSurfaceFront = MAP(BEZIER(S1)([BEZIER(S0)(cpDiagonalTimpano), BEZIER(S0)(vertexLowRightTimpano)]))(roofDomain);
	var timpanoSurfaceBack = T([1])([roofDepth])(timpanoSurfaceFront);
	var halfTimpano = STRUCT([timpanoSurfaceFront,timpanoSurfaceBack]);
	halfTimpano = COLOR(WHITE_TIMPANO)(halfTimpano);

	var roofZAxis = STRUCT([halfTimpano,roof1Surface]);
	roofZAxis.translate([1],[-colonnadeDepth]);

	return roofZAxis;
}


var buildHorizontalRoof = function() {
	var pEF = [0,0,0];
	var pEB = [0,horizontalRoofDepth,0];
	var pUM = [horizontalRoofWidth_half -parteDrittaWidth/2,horizontalRoofDepth/2,horizontalRoofHeight];
	var pMF = [horizontalRoofWidth_half -parteDrittaWidth/2,0,0];
	var pMB = [horizontalRoofWidth_half -parteDrittaWidth/2,horizontalRoofDepth,0];
	var pUC = [horizontalRoofWidth_half,horizontalRoofDepth/2,horizontalRoofHeight];
	var pCF = [horizontalRoofWidth_half,0,0];
	var pCB = [horizontalRoofWidth_half,horizontalRoofDepth,0];



	var cpHorizontalRoofExternalFront = [pEF,pUM];
	var cpHorizontalRoofExternalBack = [pEB,pUM];
	var cpMiddleFront = [pMF, pUM];
	var cpMiddleBack = [pMB, pUM];
	var cpCentralFront = [pCF, pUC];
	var cpCentralBack = [pCB, pUC];

	// surfaces
	var surfaceFrontLeft = MAP(BEZIER(S1)([BEZIER(S0)(cpHorizontalRoofExternalFront), BEZIER(S0)(cpMiddleFront)]))(roofDomain);
	var surfaceFrontCentral = MAP(BEZIER(S1)([BEZIER(S0)(cpMiddleFront), BEZIER(S0)(cpCentralFront)]))(roofDomain);
	var surfaceSide = MAP(BEZIER(S1)([BEZIER(S0)(cpHorizontalRoofExternalFront), BEZIER(S0)(cpHorizontalRoofExternalBack)]))(roofDomain);
	var surfaceBackLeft = MAP(BEZIER(S1)([BEZIER(S0)(cpMiddleBack), BEZIER(S0)(cpHorizontalRoofExternalBack)]))(roofDomain);
	var surfaceBackCentral = MAP(BEZIER(S1)([BEZIER(S0)(cpCentralBack), BEZIER(S0)(cpMiddleBack)]))(roofDomain);

	var horizontalRoof = STRUCT([surfaceFrontLeft,surfaceFrontCentral,surfaceSide,surfaceBackCentral,surfaceBackLeft]);
	horizontalRoof.translate([0,1],[-dX,-sporgenza]);
	horizontalRoof = COLOR(ROOF)(horizontalRoof);

	return horizontalRoof;
}




/* ------------------------------------------ STRUCTURE ------------------------------------------*/


var buildFloors = function() {
	buildCeilings();
}

var buildCeilings = function() {
	var externalCeiling = SIMPLEX_GRID([[11],[7],[0]]).translate([0,1,2],[wallsThickness-1,wallsThickness,lWallHeight+mWallHeight]);
	var topCeiling = SIMPLEX_GRID([[wallsThickness + 6 + stairsTotalWidth/2],[4*wallsThickness +7+7+9],[0]]).translate([0,2],[11,totalWallHeight+0.01]);

	var leftCeilings = STRUCT([externalCeiling,topCeiling]);
	var ceilings = duplicate(leftCeilings);

	DRAW(ceilings);
}


var altezzaStratoBasso = 0.1;
var	buildCornices = function() {
	/*
	var gap = 0.2; // distanza tra il pezzo più grande e quello più piccolo

	var centralCorniceLow = SIMPLEX_GRID([[stairsTotalWidth-gap],[upperColumnBase],[altezzaStratoBasso]]);
	centralCorniceLow.translate([0],[gap/2]);
	var centralCorniceMedium = SIMPLEX_GRID([[stairsTotalWidth-gap/2],[upperColumnBase],[-altezzaStratoBasso,altezzaStratoBasso]]);
	centralCorniceMedium.translate([0],[gap/4]);
	var centralCorniceHigh = SIMPLEX_GRID([[stairsTotalWidth],[upperColumnBase],[-2*altezzaStratoBasso,altezzaStratoBasso]]);

	var centralCornice = STRUCT([centralCorniceLow,centralCorniceMedium,centralCorniceHigh]);
	centralCornice.translate([0,1,2],[11+wallsThickness+6,-colonnadeDepth,lWallHeight+mWallHeight]);

	//var cornices = STRUCT([centralCornice]);
	DRAW(cornices);*/
}


var buildVilla = function(){
	buildWalls();
	buildColonnade();
	buildFrames();
	build2FlightOfSteps();
	buildFloors();
	buildCornices();
	buildRoofs();
}


/* ------------------------------------------ STOLEN ------------------------------------------*/
var domain1 = DOMAIN([[0,1],[0,1]])([20,20]);
var beige_mura = [0.992,0.96,0.901];
var grigio_colonna = [0.960,0.960,0.960];


//funzione per calcolare i knots della NUBS
function knots (points) {
  var m = points.length;
  var k = 2; //grado della curva, per ora pari a 2 (sempre)
  var n = (m + k + 1);
  var l = n - 3; //numeo da cui si parte per terminare la sequenza
  var j = 1; // primo elemento della sequenza
  var knots = [];
  for (var i = 0; i < 3; i++) {
    knots[i] = 0;
  };
  for (var i = 3; i < l; i++, j++) {
    knots[i] = j;
  };
  for (var i = l; i < n; i++) {
    knots[i] = j;
  };
 return knots;
};

//funzione che prepara la nubs a partire dai punti di controllo, per poi usarla in s1
function nubsS0 (controlpoints) {
  var curveKnots = knots(controlpoints);
  var spline = NUBS(S0)(2)(curveKnots)(controlpoints);
  return spline;
}
//Funzione che, date due nubs s0 , le adopera come argomento di una hermite s1
function hermiteS1 (nubs1, nubs2, tan1, tan2) {
  var controlpoints = [nubs1, nubs2, tan1, tan2];
  var sur = CUBIC_HERMITE(S1)(controlpoints);
  var surface = MAP(sur)(domain1);
  return surface;
}




/* ------------------------------------------ END ------------------------------------------*/
buildVilla();
