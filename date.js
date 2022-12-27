export function getDate(){
  const myDate = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return myDate.toLocaleDateString('en-GB', options);
}

export function getDay(){
  const myDate = new Date();
  const options = { weekday: 'long'};
  return myDate.toLocaleDateString('en-GB', options);
}