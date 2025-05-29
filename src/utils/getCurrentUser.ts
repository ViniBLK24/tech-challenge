export default function getCurrentUser(): string{
    const storedUser = localStorage.getItem('currentUser');

    if(storedUser){
        const user = JSON.parse(storedUser);
        return user.nome;
    } else {
        return "";
    }
}