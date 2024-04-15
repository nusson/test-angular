interface Author {
  id: number;
  username: string;
  color: string;  // Hexadecimal color for the author
}

interface Message {
  id: number;
  author: Author;
  body: string;
}

// Function to generate random hex colors
const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const authors: Author[] = [
  { id: 1, username: 'Alice', color: getRandomColor() },
  { id: 2, username: 'Bob', color: getRandomColor() },
  { id: 3, username: 'Max', color: getRandomColor() }
];

const story:[authorId:number, body:string][] = [
  [1, 'Starting my day with some fresh coffee!'],
  [1, 'Anyone want to join for a quick virtual coffee break?'],
  [3, 'I’m in! Just let me grab my cup.'],
  [2, 'Sounds good, give me 5 minutes.'],
  [3, 'By the way, has anyone seen the latest project update?'],
  [2, 'Not yet, Max. What’s the update about?'],
  [1, 'I just posted it in our project channel. It includes the new timelines.'],
  [2, 'Thanks, Alice. I’ll check it out right after this.'],
  [3, 'Interesting changes, looks like we’ve got a busy month ahead!']
]

let _id=0
export const moc = story.map((item)=>{
  const [authorId, body] = item
  const author = authors.find(({id})=>id===authorId)!
  _id ++
  return <Message>{
    id:_id,
    author,
    body
  }
})

export default moc
