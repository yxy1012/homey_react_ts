// interface utils{
//     s3Image: string; 
//     s3Resources: string; 
//     priceFilter(value: number | undefined): string | number | undefined;
// };

export default {
    s3Image: "http://homey-frontend.s3-website.us-east-2.amazonaws.com/img/",
    s3Resources: "https://homey-resources.s3.us-east-2.amazonaws.com/resources/",
    priceFilter: function(value: number | undefined){
        return value ? "$" + value.toFixed(2) : value;
    }
}