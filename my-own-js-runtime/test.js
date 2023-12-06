const sum = (a, b) => {
    return a + b;
}
const result = sum(5, 5);
mPrint('Sum 5 + 5 => ', result);
mPrint('Wait for 5 seconds...');

mTimeout(5000, 0, () => {
    mprint('Run timeout: ', new Date().toISOString());
});
