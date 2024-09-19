// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZAenHGOciDtXnVf6hkC0nzHveblgazRk",
    authDomain: "armcomments-2666f.firebaseapp.com",
    databaseURL: "https://armcomments-2666f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "armcomments-2666f",
    storageBucket: "armcomments-2666f.appspot.com",
    messagingSenderId: "62600836434",
    appId: "1:62600836434:web:97c57477e1115e4341b68b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore database reference (for storing comments)
const db = firebase.firestore();

// Local array to store comments temporarily
let comments = [];

// Function to add a comment to Firestore
async function addCommentToFirestore(commentText) {
    try {
        const docRef = await db.collection('comments').add({
            text: commentText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Comment added to Firestore: ', commentText);
        return docRef.id; // Return the document ID for later use
    } catch (error) {
        console.error('Error adding comment to Firestore:', error);
    }
}

// Handle form submission
document.getElementById('commentForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const commentText = document.getElementById('commentText').value;

    if (commentText.trim()) {
        console.log('Submitting comment:', commentText);

        // Add comment to Firestore
        const commentId = await addCommentToFirestore(commentText);

        // Add comment to local state and update UI
        comments.push({ id: commentId, text: commentText });
        displayComment({ text: commentText });

        // Clear the input field
        document.getElementById('commentText').value = '';
    } else {
        alert('Please enter a comment.');
    }
});

// Function to display a comment in the comment list
function displayComment(comment) {
    const commentList = document.getElementById('commentList');
    const div = document.createElement('div');
    const divHead = document.createElement('div')
    div.className = 'comment';
    divHead.className = 'commentHead';
    div.textContent = comment.text;
    divHead.innerHTML = "<h3>Anonymous User</h3>";
    commentList.appendChild(divHead);
    commentList.appendChild(div);
}

// Fetch comments from Firestore when the page loads and display them
async function loadCommentsFromFirestore() {
    try {
        const querySnapshot = await db.collection('comments').orderBy('timestamp','desc').get();
        comments = []; // Clear local comments
        querySnapshot.forEach((doc) => {
            const comment = doc.data();
            comments.push({ id: doc.id, text: comment.text }); // Add to local state
            displayComment(comment); // Display on the page
        });
        console.log('Comments loaded from Firestore');
    } catch (error) {
        console.error('Error fetching comments from Firestore:', error);
    }
}

// Load comments from Firestore when the page loads
window.onload = loadCommentsFromFirestore;
