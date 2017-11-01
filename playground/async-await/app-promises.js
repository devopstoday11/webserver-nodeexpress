// 3 distinct things
const users = [
  {
    id: 1,
    name: 'Andrew',
    schoolId: 101
  },
  {
    id: 2,
    name: 'Jessica',
    schoolId: 999
  }
];
const grades = [
  {
    id: 1,
    schoolId: 101,
    grade: 86
  },
  {
    id: 2,
    schoolId: 999,
    grade: 100
  },
  {
    id: 1,
    schoolId: 101,
    grade: 80
  }
];

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const user = users.find(user => user.id === id);

    if (user) {
      resolve(user);
    } else {
      reject(`unable to find user with id ${id}`);
    }
  })
}

const getGrades = (schoolId) => {
  return new Promise((resolve, reject) => {
    return resolve(grades.filter(grade => grade.schoolId === schoolId));
  })
}

const getStatus = (userId) => {
  let user;
  return getUser(userId)
    .then(tempUser => {
      user = tempUser;
      return getGrades(user.schoolId)
    })
    .then(grades => {
      const len = grades.length > 0 ? grades.length + 1.0 : 1.0;
      const avg = grades.reduce((a, b) => a.grade + b.grade) / len;
      return `${user.name} has a ${avg}%`;
    })
}

const getStatusAlt = async (userId) => {
  const user = await getUser(userId);
  const grades = await getGrades(user.schoolId);
  const avg = grades.map(g => g.grade).reduce((a,b) => a+b) / grades.length;
  return `${user.name} has a ${avg}% in the class`;
}

getUser(2).then(user => console.log(user)).catch(e => console.log(e));
getGrades(101).then(grades => console.log(grades)).catch(e => console.log(e));
getStatus(1).then(status => console.log(status)).catch(e => console.log(e));

// new async await
getStatusAlt(2).then(name => console.log(name)).catch(e => console.log(e));
