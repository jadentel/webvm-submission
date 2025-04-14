// data/questions.ts

export const questions = [
  {
    id: 1,
    title: "List Files",
    description:
      "Write a command that lists all files in the current directory. Your command should correctly handle file names with spaces.\n\n" +
      "Educational Note: The most common command is 'ls'. By itself, 'ls' displays file names. Using flags such as '-l' provides a long listing format (detailed file information) and '-a' lists all files including hidden ones. Variations include:\n" +
      "• ls -l (detailed list)\n" +
      "• ls -a (includes hidden files)\n" +
      "• ls -la or ls -al (both detailed and includes hidden files)\n" +
      "Experiment with these options to better understand directory listings.",
    starterCode: "ls -la",
    example: {
      input: "ls -la",
      output: "file1.txt  file2.txt  \"my file.docx\""
    },
    premadeFiles: [
      { name: "file1.txt", content: "This is file1 content." },
      { name: "file2.txt", content: "This is file2 content." },
      { name: "my file.docx", content: "Simulated content for a DOCX file." }
    ]
  },
  {
    id: 2,
    title: "Count Words",
    description:
      "Write a command to count the number of words in the file 'example.txt'.\n\n" +
      "Educational Note: The 'wc' (word count) command is used not only to count words (-w) but can also count lines (-l) and bytes/characters (-c). For example:\n" +
      "• wc -w example.txt  (words only)\n" +
      "• wc -l example.txt  (lines only)\n" +
      "• wc -c example.txt  (bytes/characters)\n" +
      "Understanding these options will help in processing text files more effectively.",
    starterCode: "wc -w example.txt",
    example: {
      input: "wc -w example.txt",
      output: "42 example.txt"
    },
    premadeFiles: [
      { name: "example.txt", content: "This is an example file. It contains several words to count using wc command for accurate measurement." }
    ]
  },
  {
    id: 3,
    title: "Create a Directory",
    description:
      "Write a command to create a new directory named 'projects' in the current directory.\n\n" +
      "Educational Note: The 'mkdir' command is used to create directories. A common variant is 'mkdir -p' which creates parent directories as needed. For a single directory creation, plain 'mkdir directoryName' is sufficient.\n" +
      "Try exploring the '-p' flag to see how it handles nested directories.",
    starterCode: "mkdir projects",
    example: {
      input: "mkdir projects",
      output: "Directory 'projects' created successfully."
    }
    // No premadeFiles needed for this challenge.
  },
  {
    id: 4,
    title: "Find a File",
    description:
      "Write a command that searches for a file named 'config.json' starting from the current directory and prints its relative path.\n\n" +
      "Educational Note: The 'find' command is very powerful for searching files within directory trees. It allows the use of patterns (-name), file type filters (-type), and even size or modified date filters. For example:\n" +
      "• find . -name 'config.json'\n" +
      "• find /path/to/search -type f -name '*.json'\n" +
      "Understanding these options can help you locate files quickly.",
    starterCode: "find . -name 'config.json'",
    example: {
      input: "find . -name 'config.json'",
      output: "./config/config.json"
    },
    premadeFiles: [
      { name: "config.json", content: "{ \"setting\": \"value\" }" }
    ]
  },
  {
    id: 5,
    title: "View File Contents",
    description:
      "Write a command that outputs the contents of 'README.md'. If the file is long, display only the first 10 lines.\n\n" +
      "Educational Note: The 'head' command is used to display the beginning portion of a file, while 'tail' displays the end. Key variations include:\n" +
      "• head -n 10 README.md  (first 10 lines)\n" +
      "• tail -n 10 README.md  (last 10 lines)\n" +
      "These commands are useful for quickly previewing large files.",
    starterCode: "head -n 10 README.md",
    example: {
      input: "head -n 10 README.md",
      output: "Line 1\nLine 2\n... \nLine 10"
    },
    premadeFiles: [
      { name: "README.md", content: "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11" }
    ]
  },
  {
    id: 6,
    title: "Compress Files",
    description:
      "Write a command that compresses all '.log' files in the current directory into a file named 'logs.tar.gz'.\n\n" +
      "Educational Note: The 'tar' command bundles files together. When combined with compression flags, it creates compressed archives. Common flags include:\n" +
      "• -c: create a new archive\n" +
      "• -z: filter the archive through gzip (for .gz files)\n" +
      "• -v: verbosely list files processed\n" +
      "• -f: specify the filename of the archive\n" +
      "Thus, 'tar -czvf logs.tar.gz *.log' compresses all log files. Explore other compression tools like 'bzip2' or 'xz' for different algorithms.",
    starterCode: "tar -czvf logs.tar.gz *.log",
    example: {
      input: "tar -czvf logs.tar.gz *.log",
      output: "logs.tar.gz created with all .log files compressed."
    },
    premadeFiles: [
      { name: "server.log", content: "Log entry 1\nLog entry 2\nLog entry 3" },
      { name: "access.log", content: "Access log line 1\nAccess log line 2" }
    ]
  },
  {
    id: 7,
    title: "Final Challenge: All-in-One Task",
    description:
      "Combine all your knowledge from the previous levels. Your task is to write a shell script (or a sequence of commands) that performs the following steps:\n\n" +
      "1. **List Files:** List all files in the current directory ensuring that file names with spaces are correctly handled. (Use 'ls' with appropriate flags.)\n" +
      "2. **Find File:** Recursively search for a file named 'config.json' and print its relative path. (Leverage the 'find' command with '-name'.)\n" +
      "3. **Count Words:** Count the number of words in 'example.txt'. (Use 'wc -w' to count words.)\n" +
      "4. **Create Directory:** Create a new directory called 'archive' if it doesn't already exist. (Consider using 'mkdir -p' for safety.)\n" +
      "5. **Compress Files:** Compress all '.log' files into 'logs.tar.gz' and move it into the 'archive' directory. (Employ the 'tar' command for bundling and compression.)\n\n" +
      "Finally, the script should output a summary report indicating the result of each step.\n\n" +
      "Educational Note: This final challenge is meant to integrate all the commands you have learned. It reinforces not only the syntax of individual commands but also how they can be combined in scripts to automate tasks. Experiment with variations of each command to fully understand their flexibility.",
    starterCode:
`#!/bin/bash

# Step 1: List files
echo "Listing files in the current directory:"
ls -la

# Step 2: Find config.json
CONFIG_PATH=$(find . -name 'config.json')
if [ -z "$CONFIG_PATH" ]; then
  echo "config.json not found."
else
  echo "Found config.json at: $CONFIG_PATH"
fi

# Step 3: Count words in example.txt
if [ -f "example.txt" ]; then
  WORD_COUNT=$(wc -w < example.txt)
  echo "example.txt contains $WORD_COUNT words."
else
  echo "example.txt not found."
fi

# Step 4: Create archive directory if not exists
mkdir -p archive
echo "Archive directory ensured."

# Step 5: Compress .log files and move to archive
if ls *.log 1> /dev/null 2>&1; then
  tar -czvf logs.tar.gz *.log
  mv logs.tar.gz archive/
  echo "Compressed .log files and moved to archive/logs.tar.gz"
else
  echo "No .log files found to compress."
fi

# Final Summary
echo "Summary: Files listed, config search performed, word count completed, archive directory created, and log files processed."
`,
    example: {
      input: "bash final_challenge.sh",
      output:
`Listing files in the current directory:
[file listing output...]

Found config.json at: ./config/config.json
example.txt contains 42 words.
Archive directory ensured.
Compressed .log files and moved to archive/logs.tar.gz
Summary: Files listed, config search performed, word count completed, archive directory created, and log files processed.`
    },
    premadeFiles: [
      { name: "example.txt", content: "This is a sample example text file used for word counting. It contains multiple words to count." },
      { name: "config.json", content: "{ \"app\": \"Final Challenge Config\", \"version\": 1 }" },
      { name: "app.log", content: "2025-04-14 Info: App started\n2025-04-14 Warning: Low memory" },
      { name: "error.log", content: "2025-04-14 Error: Unexpected error occurred." }
    ]
  }
];
