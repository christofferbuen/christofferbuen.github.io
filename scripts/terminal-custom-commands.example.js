/**
 * EXAMPLE: How to Add Custom Commands to Retro Terminal
 * 
 * This file demonstrates how to register custom commands
 * without modifying the core terminal or keybinds files.
 */

// Example 1: Simple command that returns text
retroTerminal.registerCommand('hello', 'Say hello', () => {
  return 'Hello, World!';
});

// Example 2: Command that uses arguments
retroTerminal.registerCommand('greet', 'Greet someone', (args) => {
  if (args) {
    return `Hello, ${args}!`;
  }
  return 'Hello! Please provide a name.';
}, [], {
  usage: 'greet <name>',
  description: 'Greets someone by name.',
  examples: ['greet Alice', 'greet Bob'],
  notes: ['Name is required']
});

// Example 3: Command with multiple aliases
retroTerminal.registerCommand('exit', 'Exit the terminal', () => {
  return 'Goodbye!';
}, ['quit', 'bye'], {
  usage: 'exit',
  description: 'Exits the terminal.',
  examples: ['exit', 'quit', 'bye']
});

// Example 4: Command with complex logic
retroTerminal.registerCommand('calc', 'Simple calculator', (args) => {
  try {
    // WARNING: eval is dangerous, this is just for demo
    const result = eval(args);
    return `Result: ${result}`;
  } catch (error) {
    return `Invalid expression: ${args}`;
  }
}, [], {
  usage: 'calc <expression>',
  description: 'Evaluates a mathematical expression.',
  examples: ['calc 2+2', 'calc 10*5', 'calc Math.sqrt(16)'],
  notes: ['Uses JavaScript eval - be careful!', 'Supports Math object']
});

// Example 5: Command that manipulates the terminal
retroTerminal.registerCommand('joke', 'Tell a random joke', () => {
  const jokes = [
    'Why do programmers prefer dark mode? Because light attracts bugs!',
    'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
    'Why did the developer go broke? He lost his cents.',
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}, [], {
  usage: 'joke',
  description: 'Displays a random programming joke.',
  examples: ['joke']
});

// Example 6: Command that returns HTML
retroTerminal.registerCommand('fortune', 'Show a fortune', () => {
  const fortunes = [
    '<span style="color: #00ff00;">You will have great success!</span>',
    '<span style="color: #00ffff;">Adventure awaits you!</span>',
    '<span style="color: #ffff00;">A bug in your code will teach you much.</span>',
  ];
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}, [], {
  usage: 'fortune',
  description: 'Displays a random fortune.',
  examples: ['fortune'],
  notes: ['Fortunes are randomly selected']
});

// Example 7: Command with options (documentation only)
retroTerminal.registerCommand('list', 'List items', (args) => {
  if (args === '--all') {
    return 'item1\nitem2\nitem3\nhidden_item1\nhidden_item2';
  }
  return 'item1\nitem2\nitem3';
}, [], {
  usage: 'list [options]',
  description: 'Lists available items.',
  examples: ['list', 'list --all'],
  options: {
    '--all': 'Show all items including hidden'
  },
  notes: ['Default shows only visible items']
});

// Now:
// - Type "help" to see all commands
// - Type "man <command>" to see detailed documentation
// - Tab completion will include all these new commands!