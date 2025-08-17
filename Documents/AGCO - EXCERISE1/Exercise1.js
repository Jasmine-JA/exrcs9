var myName = "Jasmine Jane Agco";
console.log("Name:", myName);

let myAge = "19";
console.log("Age:", myAge);

const PI = 3.1416;
console.log("PI:", PI);

let isStudent = (Number(myAge) < 25) ? true : false;
console.log("Is student:", isStudent);

let person = {
    firstName: "Jasmine",
    lastName: "Agco",
    address: {
        city: "Davao City",
        country: "Philippines"
    }
};
console.log("Person object:", person);

let colors = ["Red", "Blue", "Green", "Red", "Yellow"];
console.log("Colors array:", colors);

let words = ["apple", "banana", "grape"];
let transformedWords = [];

for (let i = 0; i < words.length; i++) {
    let reversedWord = "";
    for (let j = words[i].length - 1; j >= 0; j--) {
        reversedWord += words[i][j];
    }
    transformedWords.push(reversedWord.toUpperCase());
}
console.log("Transformed words:", transformedWords);

let numbers = [12, 45, 67, 23, 90, 32, 11, 9, 28];
let filteredNumbers = [];

for (let num of numbers) {
    if (num % 2 === 0 && num > 20) {
        filteredNumbers.push(num);
    }
}

console.log(`Found ${filteredNumbers.length} numbers: [${filteredNumbers}]`);
