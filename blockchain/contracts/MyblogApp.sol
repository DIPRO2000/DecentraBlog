// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract MyblogApp
{
    struct Post
    {
        bytes32 id;
        string author;
        string title;
        string contentHash;         // Store the content in IPFS
        uint256 upvote;
        uint256 downvote;
        uint256 timestamp;
    }

    // Mapping to store a list of all posts by the user's address
    mapping(address => bytes32[]) private userPosts;

    // Mapping to track all posts by their unique ID
    mapping(bytes32 => Post) private posts;

    // A nested mapping to ensure a user can only vote once per post
    mapping(bytes32 => mapping(address => bool)) private hasVoted;

    // Events
    event Postcreation(bytes32 indexed postId, string title, string author, uint256 timestamp);
    event PostVoted(bytes32 indexed postId, address indexed voter, bool isUpvote);

    function createPost(string memory _author, string memory _title, string memory _contentHash) public 
    {
        // Use msg.sender, a timestamp, and other unique data to prevent ID collisions.
        bytes32 _id = keccak256(abi.encodePacked(msg.sender, block.timestamp, _title, _contentHash));

        Post memory newpost = Post(
            {
                id: _id,
                author: _author,
                title: _title,
                contentHash: _contentHash,
                upvote: 0,
                downvote: 0,
                timestamp: block.timestamp
            }
        );

        userPosts[msg.sender].push(_id);
        posts[_id] = newpost;
        
        emit Postcreation(_id, _title, _author, block.timestamp);
    }

    // New function to handle upvotes
    function upvotePost(bytes32 _postId) public {
        // Ensure the post exists
        require(posts[_postId].id != bytes32(0), "Post does not exist.");

        // Check if the user has already voted on this post
        require(!hasVoted[_postId][msg.sender], "You have already voted on this post.");

        // Increment the upvote count and mark the user as voted
        posts[_postId].upvote++;
        hasVoted[_postId][msg.sender] = true;

        emit PostVoted(_postId, msg.sender, true);
    }

    // New function to handle downvotes
    function downvotePost(bytes32 _postId) public {
        // Ensure the post exists
        require(posts[_postId].id != bytes32(0), "Post does not exist.");

        // Check if the user has already voted on this post
        require(!hasVoted[_postId][msg.sender], "You have already voted on this post.");

        // Increment the downvote count and mark the user as voted
        posts[_postId].downvote++;
        hasVoted[_postId][msg.sender] = true;

        emit PostVoted(_postId, msg.sender, false);
    }

    function getAllPostsOfUser(address _user) public view returns (Post[] memory)
    {
        bytes32[] memory userPostIds = userPosts[_user];
        Post[] memory allPosts = new Post[](userPostIds.length);
        
        for (uint i = 0; i < userPostIds.length; i++) {
            allPosts[i] = posts[userPostIds[i]];
        }
        
        return allPosts;
    }

    function getPostById(bytes32 _postId) public view returns (Post memory) {
        return posts[_postId];
    }
}