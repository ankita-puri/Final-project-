// Data Journalism - D3

// Code for Chart is Wrapped Inside a Function That Automatically Resizes the Chart
function makeResponsive() {

  // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
  var svgArea = d3.select("body").select("svg");

  // Clear SVG is Not Empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  
  // Setup Chart Parameters/Dimensions
  var svgWidth = 1500;
  var svgHeight = 1000;

  // Set SVG Margins
  var margin = {
    top: 20,
    right: 100,
    bottom: 200,
    left: 200
  };

  // Define Dimensions of the Chart Area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG Element/Wrapper - Select Body, Append SVG Area & Set the Dimensions
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "anaemia";
  var chosenYAxis = "diabetes";

  // Function for Updating xScale Upon Click on Axis Label
  function xScale(acsData, chosenXAxis) {
    // Create Scale Functions for the Chart (chosenXAxis)
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(acsData, d => d[chosenXAxis]) * 0.8,
        d3.max(acsData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }

  // Function for Updating yScale Upon Click on Axis Label
  function yScale(acsData, chosenYAxis) {
    // Create Scale Functions for the Chart (chosenYAxis)
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(acsData, d => d[chosenYAxis]) * 0.8,
        d3.max(acsData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
    return yLinearScale;
  }

  // Function for Updating xAxis Upon Click on Axis Label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function for Updating yAxis Upon Click on Axis Label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Function for Updating Circles Group with a Transition to New Circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]))
       .attr("fill",function(d){
       return (d.DEATH_EVENT == 1) ? "red":"blue"
      });
      
      ;
    return circlesGroup;
  }

  // Function for Updating Text Group with a Transition to New Text
  function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle")
      .attr("text",function(d){
        return (d.DEATH_EVENT == 1) ? "Dead":"Survived"
      });
    return textGroup;
  }

  // Function for Updating Circles Group with New Tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    if (chosenXAxis === "anaemia") {
      var xLabel = "Is Patient Anaemic?";
    }
    else if (chosenXAxis === "age") {
      var xLabel = "Age";
    }
    else if (chosenXAxis === "platelets") {
      var xLabel = "Platelet Count";
    }
    else if (chosenXAxis === "serum_creatinine") {
      var xLabel = "Serum Creatinine Count";
    }
    else if (chosenXAxis === "serum_sodium") {
      var xLabel = "Serum Sodium Count";
    }
    else {
      var xLabel = "Household creatinine_phosphokinase (Median)";
    }
    if (chosenYAxis === "diabetes") {
      var yLabel = "Is Patient Diabetic?";
    }
    else if (chosenYAxis === "ejection_fraction") {
      var yLabel = "Ejection Fraction (%)";
    }
    else if (chosenYAxis === "sex") {
      var yLabel = "Sex";
    }
    else if (chosenYAxis === "smoking") {
      var yLabel = "IS Patient Smoker?";
    }
    else if (chosenYAxis === "time") {
      var yLabel = "Time";
    }
    else {
      var yLabel = "high_blood_pressure (%)";
    }

function dead_or_alive(result){
  if (result == 1) {
    var doa = "Dead";}
    else {
      var doa = "Survived";;
    }
    return (doa)}

    // Initialize Tool Tip
    var toolTip = d3.tip()
      .attr("class", "tooltip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${dead_or_alive(d.DEATH_EVENT)}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
      })
      // .attr("fill",function(d){
      //  return (d.DEATH_EVENT == 1) ? "red":"blue"
      // });
    // Create Circles Tooltip in the Chart
    circlesGroup.call(toolTip);
    // Create Event Listeners to Display and Hide the Circles Tooltip
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout Event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    // Create Text Tooltip in the Chart
    textGroup.call(toolTip);
    // Create Event Listeners to Display and Hide the Text Tooltip
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout Event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
    return circlesGroup;
  }

  // Import Data from the data.csv File & Execute Everything Below

  url = d3.csv("data.csv")
  .then(function(acsData) {


  // d3.csv("assets/data/data.csv")
  //   .then(function(acsData) {

    // Format/Parse the Data (Cast as Numbers)
    acsData.forEach(function(data) {
      // xdata
      data.anaemia = +data.anaemia;
      data.age = +data.age;
      data.creatinine_phosphokinase = +data.creatinine_phosphokinase;
      data.platelets = +data.platelets;
      data.serum_creatinine = +data.serum_creatinine;
      data.serum_sodium = +data.serum_sodium;
      // y data
      data.diabetes = +data.diabetes;
      data.ejection_fraction = +data.ejection_fraction;
      data.high_blood_pressure = +data.high_blood_pressure;
      data.sex = +data.sex;
      data.smoking = +data.smoking;
      data.time = +data.time;




    });
// age,anaemia,creatinine_phosphokinase,diabetes,ejection_fraction,
// high_blood_pressure,
// platelets,serum_creatinine,serum_sodium,sex,smoking,time,DEATH_EVENT

// acsData.forEach(function(data) {
//   data.poverty = +data.poverty;
//   data.age = +data.age;
//   data.income = +data.income;
//   data.healthcare = +data.healthcare;
//   data.obesity = +data.obesity;
//   data.smokes = +data.smokes;
    // Create xLinearScale & yLinearScale Functions for the Chart
    var xLinearScale = xScale(acsData, chosenXAxis);
    var yLinearScale = yScale(acsData, chosenYAxis);

    // Create Axis Functions for the Chart
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append xAxis to the Chart
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // Append yAxis to the Chart
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    // Create & Append Initial Circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
      .data(acsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("class", "stateCircle")
      .attr("r", 15)
      .attr("opacity", ".75");

    // Append Text to Circles
    var textGroup = chartGroup.selectAll(".stateText")
      .data(acsData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
      .text (d =>(d.DEATH_EVENT))
      .attr("class", "stateText")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");


      //       .text (function (d){( if (d.DEATH_EVENT == 1) 
        // var doa = "Dead";
        // else {
        //   var doa = "Survived";
        // }}
        // return (doa)})









// platelets
// Platelets in the blood (kiloplatelets/mL)

// serum_creatinine
// Level of serum creatinine in the blood (mg/dL)

// serum_sodium
// Level of serum sodium in the blood (mEq/L)

// sex
// Woman or man (binary)
    // Create Group for 3 xAxis Labels
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    // Append xAxis
    var anaemiaLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "anaemia") // Value to Grab for Event Listener
      .classed("active", true)
      .text("Does Patient have Anaemia y/n? - Decrease of red blood cells or hemoglobin");

    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // Value to Grab for Event Listener
      .classed("inactive", true)
      .text("Age");

    var creatinine_phosphokinaseLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "creatinine_phosphokinase") // Value to Grab for Event Listener
      .classed("inactive", true)
      .text("Creatinine Phosphokinase - Level of the CPK enzyme in the blood (mcg/L)");
      // New VALS
    var plateletsLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 80)
      .attr("value", "platelets") // Value to Grab for Event Listener
      .classed("inactive", true)
      .text("Platelets in the blood (kiloplatelets/mL)");  
    var serum_creatinineLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 100)
      .attr("value", "serum_creatinine") // Value to Grab for Event Listener
      .classed("inactive", true)
      .text("Level of serum creatinine in the blood (mg/dL)");
    var serum_sodiumLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 120)
      .attr("value", "serum_sodium") // Value to Grab for Event Listener
      .classed("inactive", true)
      .text("Level of serum sodium in the blood (mEq/L)");   
      // plateletsLabel
      // serum_creatinineLabel
      // serum_sodiumLabel

    // Create Group for 3 yAxis Labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-25, ${height / 2})`);
    // Append yAxis
    var diabetesLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", 0)
      .attr("value", "diabetes")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Does Patient have Diabetes y/n?");

    var high_blood_pressureLabel = yLabelsGroup.append("text") 
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .attr("value", "high_blood_pressure")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("If the patient has hypertension");

    var ejection_fractionLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", 0)
      .attr("value", "ejection_fraction")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Ejection Fraction - Percentage of blood leaving the heart at each contraction");
      // New Y Vals
    var sexLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -90)
      .attr("x", 0)
      .attr("value", "sex")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("active", true)
      .text("Patient Sex");

    var smokingLabel = yLabelsGroup.append("text") 
      .attr("transform", "rotate(-90)")
      .attr("y", -110)
      .attr("x", 0)
      .attr("value", "smoking")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Is Patient Smoker?");

    var timeLabel = yLabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -130)
      .attr("x", 0)
      .attr("value", "time")
      .attr("dy", "1em")
      .classed("axis-text", true)
      .classed("inactive", true)
      .text("Time");
      // data.high_blood_pressure = +data.high_blood_pressure;
      // data.sex = +data.sex;
      // data.smoking = +data.smoking;
      // data.time = +data.time;
    // updateToolTip Function
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // xAxis Labels Event Listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // Get Value of Selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
          // Replaces chosenXAxis with Value
          chosenXAxis = value;
          // Updates xScale for New Data
          xLinearScale = xScale(acsData, chosenXAxis);
          // Updates xAxis with Transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          // Updates Circles with New Values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
          // Updates Tooltips with New Information
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
          // Changes Classes to Change Bold Text
          if (chosenXAxis === "anaemia") {
            anaemiaLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            plateletsLabel
              .classed("active", false)
              .classed("inactive", false);
            serum_creatinineLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_sodiumLabel
              .classed("active", false)
              .classed("inactive", true);
          // }      plateletsLabel
          // serum_creatinineLabel
          // serum_sodiumLabel
          }
          else if (chosenXAxis === "age") {
            anaemiaLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            plateletsLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_creatinineLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_sodiumLabel
              .classed("active", false)
              .classed("inactive", true);  
          }
          else if (chosenXAxis === "platelets") {
            anaemiaLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            plateletsLabel
              .classed("active", true)
              .classed("inactive", false);
            serum_creatinineLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_sodiumLabel
              .classed("active", false)
              .classed("inactive", true);  

          }
          else if (chosenXAxis === "serum_creatinine") {
            anaemiaLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            plateletsLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_creatinineLabel
              .classed("active", true)
              .classed("inactive", false);
            serum_sodiumLabel
              .classed("active", false)
              .classed("inactive", true);  

          }
          else if (chosenXAxis === "serum_sodium") {
            anaemiaLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            plateletsLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_creatinineLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_sodiumLabel
              .classed("active", true)
              .classed("inactive", false);  

          }


          else {
            anaemiaLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            creatinine_phosphokinaseLabel
              .classed("active", true)
              .classed("inactive", false);
            plateletsLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_creatinineLabel
              .classed("active", false)
              .classed("inactive", true);
            serum_sodiumLabel
              .classed("active", false)
              .classed("inactive", true);    
          }
        }
      });
    
      // yAxis Labels Event Listener
    yLabelsGroup.selectAll("text")
      .on("click", function() {
        // Get Value of Selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
          // Replaces chosenYAxis with Value
          chosenYAxis = value;
          // Updates yScale for New Data
          yLinearScale = yScale(acsData, chosenYAxis);
          // Updates yAxis with Transition
          yAxis = renderYAxes(yLinearScale, yAxis);
          // Updates Circles with New Values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
          // Updates Text with New Values
          textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)
          // Updates Tooltips with New Information
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
          // Changes Classes to Change Bold Text
          if (chosenYAxis === "diabetes") {
            diabetesLabel
              .classed("active", true)
              .classed("inactive", false);
            ejection_fractionLabel
              .classed("active", false)
              .classed("inactive", true);
            high_blood_pressureLabel
              .classed("active", false)
              .classed("inactive", true);
            sexLabel
              .classed("active", true)
              .classed("inactive", false);
            smokingLabel
              .classed("active", false)
              .classed("inactive", true);
            timeLabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else if (chosenYAxis === "ejection_fraction") {
            diabetesLabel
              .classed("active", false)
              .classed("inactive", true);
            ejection_fractionLabel
              .classed("active", true)
              .classed("inactive", false);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            sexLabel
              .classed("active", true)
              .classed("inactive", false);
            smokingLabel
              .classed("active", false)
              .classed("inactive", true);
            timeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "sexLabel") {
            diabetesLabel
              .classed("active", false)
              .classed("inactive", true);
            ejection_fractionLabel
              .classed("active", false)
              .classed("inactive", true);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            sexLabel
              .classed("active", true)
              .classed("inactive", false);
            smokingLabel
              .classed("active", false)
              .classed("inactive", true);
            timeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokingLabel") {
            diabetesLabel
              .classed("active", false)
              .classed("inactive", true);
            ejection_fractionLabel
              .classed("active", false)
              .classed("inactive", true);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            sexLabel
              .classed("active", false)
              .classed("inactive", true);
            smokingLabel
              .classed("active", true)
              .classed("inactive", false);
            timeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "timeLabel") {
            diabetesLabel
              .classed("active", false)
              .classed("inactive", true);
            ejection_fractionLabel
              .classed("active", false)
              .classed("inactive", true);
            creatinine_phosphokinaseLabel
              .classed("active", false)
              .classed("inactive", true);
            sexLabel
              .classed("active", false)
              .classed("inactive", true);
            smokingLabel
              .classed("active", false)
              .classed("inactive", true);
            timeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
            diabetesLabel
              .classed("active", false)
              .classed("inactive", true);
              ejection_fractionLabel
              .classed("active", false)
              .classed("inactive", true);
              high_blood_pressureLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
  });
}
// When Browser Loads, makeResponsive() is Called
makeResponsive();

// When Browser Window is Resized, makeResponsive() is Called
d3.select(window).on("resize", makeResponsive);