
async function drawChart() {

    // 1. Access data 

    const dataset = d3.json("./US.json");
    console.log(dataset[0]);

    const dateParser = d3.timeParse("%d/%m/%Y");
    const dateAccessor = d => dateParser(d.date);
    const random = d => d.numerator;
    const notes = d => d.Notes;
    console.log(dateAccessor);

    const width = 800;
    const ch = 800;
    const cw = width;

    const scaleDayz = d3.scaleLinear()
        .domain([0,lots.size])
        .range( [5,ch-5])
    
    function lots(){
  
        dataset.sort(function compare(a, b) {     
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateA - dateB;
        })
      
        let data = new Map()
      
        dataset.map(d=>{
          data.set( d.date, [] )               
        })  
      
        dataset.map(d=>{
          data.get(d.date).push(d.numerator);  
        })   
      
        data.forEach((values,keys)=>{
          values.sort()                      
        })
      
        return data
    }

  const svg = d3.create('svg')
            .append("svg")
            .attr("width", cw)
            .attr("height", ch)
  
  const Dates = svg.append("g").attr('id','Dates')

  const timeScale = d3.scaleTime()
  .domain([new Date(dateParser(Array.from(lots)[0][0])), new Date(dateParser(Array.from(lots)[lots.size-1][0]))] )
  .range( [0, 360]);
  
  let index = 0
  lots.forEach((values,key)=>{
  
    Dates.append("g").attr('id',`day_${_.snakeCase(key)}`)
      .selectAll("circle")
      .data(values)
      .join("circle")
        .attr("cx", d=> d*cw)
        .attr("cy", 0)  
        .attr("r", d=> d*5)             
        .style('opacity','50%')
        .attr('fill','red')  
    index++
  }) 

  index=0
  lots.forEach((values,key)=>{  
    svg.select(`#day_${_.snakeCase(key)}`)
        .attr('transform',`translate(400 400) scale(0.49) rotate(${index++})  `)  
} ) 

  }
  drawChart()
