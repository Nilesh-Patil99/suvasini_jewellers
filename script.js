// Function to add a new row to the jewelry details table
function addRow() {
  const table = document
    .getElementById("jewelryTable")
    .getElementsByTagName("tbody")[0];
  const newRow = table.insertRow();
  newRow.classList.add("bg-gray-200"); // Add the bg-gray-50 class to the row

  for (let i = 0; i < 15; i++) {
    const cell = newRow.insertCell(i);
    
    
    if(i === 12){
      // const cell = newRow.insertCell(i);
      const txt = document.createElement("textarea");
      txt.name = "misc[]"
      txt.classList.add("w-full", "p-3", "border", "border-gray-300", "rounded-lg"); // Add styling classes to textarea
      cell.appendChild(txt);

    }else if ( i !== 12){
      // const cell = newRow.insertCell(i);
    const input = document.createElement("input");
  
    

    input.type =
      i === 5 || i === 6 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11
        ? "number"
        : i===14? "checkbox": 
    input.name =
      i === 0
        ? "styleNumber[]"
        : i === 1
        ? "brand[]"
        : i === 2
        ? "itemName[]"
        : i === 3
        ? "pcs[]"
        : i === 4
        ? "carat[]"
        : i === 5
        ? "grossWeight[]"
        : i === 6
        ? "netWeight[]"
        : i === 7
        ? "stoneNos[]"
        : i === 8
        ? "stonePrice[]"
        : i === 9
        ? "goldRate[]"
        : i ===10
        ? "labour[]"
        : i===11
        ? "total[]"
        : i===12
        ? "miscValue[]"
        : i ===14 ? "hallMark[]": null
        
       

    if (i === 6 || i === 5) {
      input.step = "0.001";
    } else {
      input.step = "1"; // For fields that don't require decimals, you can set step to "1"
    }
    input.classList.add("w-full", "p-3", "border", "border-gray-300", "rounded-lg"); // Add styling classes to input
    cell.appendChild(input);
    }
    
  }
}

//delete last row
function deleteLastRow() {
  var table = document.getElementById("jewelryTable"); // Get the table element by ID
  var rows = table.getElementsByTagName("tr"); // Get all rows of the table

  if (rows.length > 1) {  // Check if there is more than one row (excluding the header)
    table.deleteRow(rows.length - 1); // Delete the last row
  } else {
    alert("No rows to delete!");
  }
}


// Set the date input to today's date by default
window.onload = function () {
  const dateInput = document.getElementById("date");
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();
  dateInput.value = `${year}-${month}-${day}`;
};

// Function to generate the PDF
function generatePDF(event) {
  event.preventDefault();

  document.querySelectorAll("input").forEach((input) => {
    input.value = input.value.toUpperCase();
  });

  const name = document.getElementById("name").value;

  const date = document.getElementById("date").value;
  const billNo = document.getElementById("billNo").value;
  const mop = document.getElementById("mop").value;
  const contact = document.getElementById("contact").value;
  const address = document.getElementById("address").value;

  // Getting all the jewelry data
  const jewelryData = [];
  const rows = document
    .getElementById("jewelryTable")
    .getElementsByTagName("tbody")[0].rows;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells;
    const row = {
      styleNumber: cells[0].children[0].value,
      brand: cells[1].children[0].value,
      itemName: cells[2].children[0].value,
      pcs: cells[3].children[0].value,
      carat: cells[4].children[0].value,
      grossWeight: cells[5].children[0].value,
      netWeight: cells[6].children[0].value,
      stoneNos: cells[7].children[0].value,
      stonePrice: cells[8].children[0].value,
      goldRate: cells[9].children[0].value,
      labour: cells[10].children[0].value,
      total: cells[11].children[0].value,
      misc: cells[12].children[0].value,
      miscValue: cells[13].children[0].value,
      hallMark: cells[14].children[0].checked,

    };
    jewelryData.push(row);
  }

  console.log(jewelryData[0].hallMark)

  //Calculations
  let gstToggle = document.getElementById("gst-toggle");
  let grossWeightToggle = document.getElementById("wt-toggle");

  // Create the PDF using jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // Draw a border around the whole page
  // Get the page width and height

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Load the image from a URL or base64 (for example, base64 image)
  const imageUrl = "./Head.png";
  // Add the image at the top of the page (header) with specific width and height
  // Parameters: image URL, x position, y position, width, hei    ght
  doc.addImage(imageUrl, "PNG", 0, 0, pageWidth, pageHeight);

  // Title & Info
  doc.setFont("times");
  doc.setFontSize(20);
  doc.setFontSize(10);
  doc.text(`Shri/Smt:  `, 7, 59);
  doc.text(`Contact:  `, 7, 64);
  doc.text(`M.O.P:  `, 7, 69);
  doc.text(`Address:  `, 7, 74);
  doc.setFont("times", "bold");
  doc.text(name, 23, 59);
  doc.text(contact, 23, 64);
  doc.text(mop, 23, 69);
  doc.text(address, 23, 74);
  doc.text(`Date: ${date}`, 175, 65);
  doc.text(`Bill No.: SJ/${billNo}`, 175, 72);

  // Table Header
  const headers = [
    "STYLE S/R",
    "BRAND",
    "ITEM NAME",
    "PCS",
    "CARAT",
    "GROSS WEIGHT",
    "NET WEIGHT",
    "STONE NOS",
    "STONE PRICE",
    "GOLD RATE",
    "LABOUR",
    "Misc.",
    "TOTAL",
  ];
  let tableData = jewelryData.map((item) => [
    item.styleNumber,
    item.brand,
    item.itemName,
    item.pcs,
    item.carat,
    item.grossWeight,
    item.netWeight,
    item.stoneNos,
    item.stonePrice,
    item.goldRate,
    item.labour,
    item.misc
  ]);

  //calculate total costing for each row
  function totalCal(i) {
    if(jewelryData[i].total){
      return jewelryData[i].total
    }else{


      let weightForLabour = 0;
      if (grossWeightToggle.checked == true) {
        console.log("grosschecked");
        weightForLabour = jewelryData[i].grossWeight;
        
      } else {
        weightForLabour = jewelryData[i].netWeight;
      }

      // check for hall mark price
    let hallmarkcharges = 0
    console.log(jewelryData[i].hallMark)
    if(jewelryData[i].hallMark == true){
      hallmarkcharges = 350
    }
   
    //check for misc values
    let miscCharge = 0
    if(jewelryData[i].miscValue){
      miscCharge = jewelryData[i].miscValue
    }

    let labourPerGram;
    if (gstToggle.checked == true) {
      console.log("checked");
      let gRForLabour = jewelryData[i].goldRate * 1.03;
      labourPerGram = gRForLabour * ( jewelryData[i].labour / 100 )
    } else {
      let gRForLabour = jewelryData[i].goldRate ;
      labourPerGram = gRForLabour * ( jewelryData[i].labour / 100 )
    }


    //labour costing
    let labourCost;
    if (jewelryData[i].labour < 100) {
      labourCost = labourPerGram * (Math.ceil(weightForLabour));
    } else {
      labourCost = jewelryData[i].labour;
    }
    let goldCost = jewelryData[i].netWeight * (jewelryData[i].goldRate * 1.03);
    

    //stone costing
    let stoneCost = jewelryData[i].stoneNos * jewelryData[i].stonePrice;

    //final costing
    console.log('gold cost - ' +goldCost)
    console.log('stone cost -' +stoneCost)
    console.log( 'hallmark - '+ hallmarkcharges)
    console.log('labour- ' +labourCost)
    let finalTotal =+jewelryData[i].pcs*(goldCost + stoneCost + +hallmarkcharges + +miscCharge + +labourCost)  ;
    finalTotal= Math.floor(finalTotal)

    return finalTotal;
    }
    
  }


  for (let i = 0; i < rows.length; i++) {
    tableData[i].push(totalCal(i));
  }


  // Grand TOtal Calculation
  function grandTotal() {
    let tempTotal = 0;
    for (let i = 0; i < tableData.length; i++) {
      tempTotal += +tableData[i][tableData[i].length - 1];
    }
    return tempTotal;
  }

  const totalAmount = grandTotal();
 console.log(totalAmount)




  //number to word and final amout display
  let words = n2words(totalAmount, { lang: 'en-IN' });
  
  // let words = numberToWords.toWords(totalAmount);
  function capitalizeFirstLetterOfEachWord(str) {
    return str
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back into a single string
  }

  const capWords = capitalizeFirstLetterOfEachWord(words);
  doc.setFont("courier", "italic", "bold");

  doc.text(`${capWords} Only/-`, 9, 231, { maxWidth: 150 });
  doc.setFont("times", "normal", "bold");

  doc.text(`${Math.round(totalAmount)}`, 178, 231);
  doc.text(`${Math.round(totalAmount)}`, 180, 246);




  // add % for labour value if its >100
  for (let i = 0; i < rows.length; i++) {
    if (jewelryData[i].labour < 100) {
      tableData[i][10] = tableData[i][10] + " %";
    }
  }

  // Table Content
  const options = {
    fontSize: 6,
    halign: "center",
    valign: "middle",
    textColor: 0,
    headStyles: {
      fontSize: 10, // Header font size
      fontStyle: "bold", // Bold header text
      fillColor: [255, 255, 255], // Header background color (white)
    },
    bodyStyles: {
      fontSize: 3, // Data font size
      fillColor: [240, 240, 240], // Body row background color (light gray)
    },
  };
  doc.autoTable({
    startY: 100,
    styles: options,
    headStyles: {
      font: "times",
      fontSize: 6, // Header font size
      fontStyle: "bold", // Bold header text
      fillColor: [240, 240, 240], // Header background color (white)
    },
    bodyStyles: {
      font: "times",
      fontSize: 6, // Data font size
      fillColor: null, // Body row background color (light gray)
    },
    columnStyles: { 2: { cellWidth: 50 } },

    theme: "grid",
    head: [headers],
    body: tableData,
  });

  // Save the PDF
  doc.save(`${name}.pdf`);

}

// Attach event listener to the form submission
document.getElementById("invoiceForm").addEventListener("submit", generatePDF);
