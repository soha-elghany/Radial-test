async function drawChart() {

    // 1. Access data
  
    const dataset = await d3.json("./US.json")
    console.log(dataset[0])

    const dateParser = d3.timeParse("%d/%m/%Y")
    const dateAccessor = d => dateParser(d.date)
    const random = d => d.numerator
    // const notes = d => d.Notes
    // const maxAccessor = d3.max(random)
    // const minAccessor = d3.min(random)
    console.log(dateAccessor)

    const angleScale = d3.scaleTime()
        .domain(d3.extent(dataset, dateAccessor))
        .range([0, Math.PI * 2])
    
    const width = 600
    let dimensions = {
        width: width,
        height: width,
        radius: width/2,
        margin: {
            top: 120,
            right:120,
            bottom:120,
            left:120,    
        },
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom
    dimensions.boundedRadius = dimensions.radius
        - ((dimensions.margin.left + dimensions.margin.right) / 2)
    
    const getCoordinatesForAngle = (angle, offset=1) => [
        Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
        Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    ]
    
    const wrapper = d3.select("#wrapper")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dimensions.margin.left + dimensions.boundedRadius
        }px, ${
            dimensions.margin.top + dimensions.boundedRadius
        }px)`)


    // draw peripherals 
    const peripherals = bounds.append("g")
    const months = d3.timeMonths(...angleScale.domain())
    console.log(months) 
    const gridLines = months.forEach(month => {
        const angle = angleScale(month)
        return peripherals.append("line")
    })

    months.forEach(month => {
        const angle = angleScale(month)
        const [x,y] = getCoordinatesForAngle(angle)

        peripherals.append("line")
            .attr("x2", x)
            .attr("y2", y)
            .attr("class", "grid-line")
        
        const [labelX, labelY] =
            getCoordinatesForAngle(angle, 1.38)
            peripherals.append("text")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("class", "tick-label")
            .text(d3.timeFormat("%b")(month))
            .style("text-anchor",
                Math.abs(labelX) <5 ? "middle" :
                labelX > 0 ? "start": 
                "end") 
    })

    // const radiusScale = d3.scaleLinear()
    //     .domain(d3.extent ([
    //         ...dataset.map(maxAccessor),
    //         ...dataset.map(minAccessor),
    //     ]))
    //     .range([0, dimensions.boundedRadius])
    //     .nice()

    const getXFromDataPoint = (d, offset=1.4) => getCoordinatesForAngle(
        angleScale(dateAccessor(d)),
        offset
    )
    const getYFromDatePoint = (d, offset=1.4) => getCoordinatesForAngle(
        angleScale(dateAccessor(d)),
        offset
    )

    // const randomTicks = radiusScale.ticks(4)
    // const gridCircles = randomTicks.map(d => (peripherals.append("circle")
    //     .attr("r", radiusScale(d))
    //     .attr("class", "grid-line")
    // ))

    const randomRadiusScale = d3.scaleSqrt()
        .domain(d3.extent(dataset, random))
        .range([0, 1])
    
    // const randomGroup = bounds.append("g")
    
    // const randomOffset = 0.27

    // const randomDots = randomGroup.selectAll("circle")
    //     .data(dataset)
    //     .enter().append("circle")
    //         .attr("class", "random-dot")
    //         .attr("cx", d=> getXFromDataPoint(d, randomOffset))
    //         .attr("cy", d=> getYFromDataPoint(d, randomOffset))
    //         .attr("r", d=> randomRadiusScale(random(d)))

    const scale =1 
    const circles = bounds.append("g")
    .selectAll("circle")
    .data(dataset)
    .join("circle")
    .attr("r", d => d.numerator*scale)  // further scaling could be does using a scale function
    .attr('cx', (d,i) => i%getXFromDataPoint*getYFromDatePoint)
    .attr('cy', (d,i) => Math.floor(i/getXFromDataPoint))
    .attr("fill", "#f2d974")
    .attr("fill-opacity", 0.4);


  }
  drawChart()