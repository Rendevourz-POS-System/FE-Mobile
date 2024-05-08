export const getIconName = (type : string) => {
    switch(type) {
        case 'Cat' : 
            return 'cat';
        case 'Dog':
            return 'dog';
        case 'Rabbit':
            return 'rabbit';
        case 'Hamster':
            return 'hamster';
        default:
            return '';
    }
}