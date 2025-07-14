export default function getCurrentUserId(): string{
    const storedUser = localStorage.getItem('currentUser');

    if(storedUser){
        const user = JSON.parse(storedUser);
        return user.id;
    } else {
        return "";
    }
}