/*Generates a Markov chain from given text with the given order*/
function generateMarkovChain(text, order) {
  let result = {};
  for (let i = 0; i < text.length - order; i++) {
    let current = '';
    for (let j = 0; j < order; j++) {
      current += text[i + j];
    }
    result[current] = {};
  }

  for (let i = 0; i < text.length - order; i++) {
    let predictor = '';
    for (let j = 0; j < order; j++) {
      predictor += text[i + j];
    }
    let prediction = text[i + order];
    result[predictor][prediction] = 0;
  }

  for (let i = 0; i < text.length - order; i++) {
    let predictor = '';
    for (let j = 0; j < order; j++) {
      predictor += text[i + j];
    }
    let prediction = text[i + order];
    result[predictor][prediction] = result[predictor][prediction] + 1;
  }
  return result;
}
 
/*Takes a chain with integer count of elements and reduces the count into probabilities (non-cumulative)*/
function normalizeChain(chainObject) {

  let result = JSON.parse(JSON.stringify(chainObject));

  for (let prop in chainObject) {
    let count = 0;
    for (let prop2 in chainObject[prop]) {
      count += chainObject[prop][prop2];
    }
    for (let prop2 in chainObject[prop]) {
      result[prop][prop2] = chainObject[prop][prop2] / count;
    }
  }

  return result;
}

/*Returns an array with proabilities of the next item in the sequence based on the property of the chain*/
function getArray(chain, property) {
  let result = [];
  for (prop in chain) {
    if (prop === property) {
      result = Object.entries(chain[property]);
    }

  }
  result.sort((a, b) => {
    return b[1] - a[1];
  });

  return result;
}

/*Converts non-cumulative result of getArray into a cumulative array, for easier text generation*/
function getCumulativeArray(chain, property) {
  let result = getArray(chain, property);
  let current = 0;
  for (let i = 0; i < result.length; i++) {
    current = current + result[i][1];
    result[i][1] = current;
  }
  return result;
}

/*Generate text of a given length from a chain with starting sequence of 'start'*/
function generateText(chain, start, numberOfCharactersToGenerate) {
  let current = start;
  let result = current;
  for (let j = 0; j < numberOfCharactersToGenerate; j++) {
    let pred = '';
    let cumutest = getCumulativeArray(chain, current);
    for (let i = 0; i < cumutest.length; i++) {
      let roll = Math.random();
      if (cumutest[i][1] > roll) {
        pred = cumutest[i][0];
        break;
      }
    }
    result += pred;
    current += pred;
    current = current.slice(1);

  }
  return result;

}

/*Puts a paragraph with the generated text into the DOM*/
function addParagraph(startingLetter, length, chainObject) {
  let d = document.querySelector('#main');
  let p = document.createElement('p');
  p.append(generateText(chainObject, startingLetter, length));
  d.prepend(p);
}
