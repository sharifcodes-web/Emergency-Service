1. Difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll

document.getElementById("id")
→ শুধুমাত্র একটা element খুঁজে বের করে, যার id দেওয়া আছে।
let el = document.getElementById("myDiv");
document.getElementsByClassName("class")
→ একই class নামের সবগুলো element বের করে দেয় (একটা HTMLCollection, অর্থাৎ array-এর মতো কিন্তু পুরোপুরি array না)।

let items = document.getElementsByClassName("item");


document.querySelector("selector")
→ CSS Selector দিয়ে element খুঁজে বের করে, কিন্তু শুধু প্রথমটি দেয়। 

let firstItem = document.querySelector(".item");   // প্রথম .item পাবে


document.querySelectorAll("selector")
→ CSS Selector দিয়ে element খুঁজে বের করে, সবগুলো দেয় (একটা NodeList আকারে)।

let allItems = document.querySelectorAll(".item"); // সব .item পাবে


✅ সহজভাবে:

getElementById → একটাই id → একটাই element

getElementsByClassName → class দিয়ে একাধিক element (HTMLCollection)

querySelector → CSS selector, প্রথম element

querySelectorAll → CSS selector, সব element (NodeList)
<!-- --------- -->
2. How do you create and insert a new element into the DOM?

নতুন element তৈরি  → document.createElement("tagName")

ভেতরে লেখা → element.textContent = "Hello"

 → parent = document.getElementById("container")

 → parent.appendChild(newElement)



let newDiv = document.createElement("div");
newDiv.textContent = "This is a new div!";
document.body.appendChild(newDiv);


এতে body-এর নিচে নতুন div যোগ হবে।
<!-- --------- -->

3. What is Event Bubbling and how does it work?

Event Bubbling মানে হলো, একটা event ভেতরের element থেকে শুরু হয়ে বাইরের element পর্যন্ত চলে যাওয়া।

একটা <button> যদি <div> এর ভেতরে থাকে, আর তুমি বাটনে click করো →

প্রথমে button এ event হবে

তারপর event div এ যাবে

তারপর body → html → document → window পর্যন্ত যাবে

👉 এটা by default ঘটে যায়।
<!-- -------- -->

4. What is Event Delegation? Why is it useful?

Event Delegation মানে হলো একটা parent element এ event listener বসানো, যাতে ভেতরের child element গুলোর event একসাথে হ্যান্ডেল করা যায়।



অনেকগুলো <li> এর ভেতরে আলাদা আলাদা click event বসাতে। এক এক করে দিলে ঝামেলা হবে।

তার বদলে <ul> এ event বসা → event bubbling এর মাধ্যমে বুঝবে কোন <li> এ click হয়েছে।



document.getElementById("list").addEventListener("click", function(e) {
  if(e.target.tagName === "LI") {
    alert("You clicked: " + e.target.textContent);
  }
});


✅ এতে একটা listener দিয়েই অনেক child handle করা যায় → performance ভালো হয়, কম কোড লাগে।
<!-- ------- -->

5. Difference between preventDefault() and stopPropagation()

event.preventDefault()
→ কোনো element-এর default কাজ বন্ধ করে দেয়।
যেমন: form submit হলে normally page reload হয় → preventDefault দিলে সেটা হবে না।

form.addEventListener("submit", function(e) {
  e.preventDefault(); // reload বন্ধ করবে
  console.log("Form submitted!");
});


event.stopPropagation()
→ event bubbling/propagation বন্ধ করে দেয়, মানে event বাইরের element-এ আর যাবে না।

button.addEventListener("click", function(e) {
  e.stopPropagation(); // event শুধু button এ থেমে যাবে
  console.log("Button clicked only!");
});


✅ সহজভাবে:

preventDefault() → element-এর default কাজ বন্ধ করে

stopPropagation() → event উপরের element-এ ছড়ানো বন্ধ করে