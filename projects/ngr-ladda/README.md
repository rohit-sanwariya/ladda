## Installation

To install the library, run:

```bash
npm install ngr-ladda
```

## Usage

First, import the `LaddaDirective` in your Angular module:

```typescript
import {LaddaDirective} from 'ngr-ladda'

@NgModule({
    declarations: [
        // your components
    ],
    imports: [
        // other modules
        LaddaDirective
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

Then, you can use the `ladda` directive in your templates:

```html
<button ladda="isLoading" (click)="doSomething()">Submit</button>
```

In your component, define the `isLoading` property and the `doSomething` method:

```typescript
export class YourComponent {
    isLoading = false;

    doSomething() {
        this.isLoading = true;
        // perform your action
        // set isLoading to false when done
    }
}
```

## Features

- **Loading Indicator**: Easily add a loading indicator to your buttons.
- **Customizable**: Customize the loading indicator with various options.
- **Easy Integration**: Simple to integrate with your existing Angular application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/rohit-sanwariya/ladda).

## License

This project is licensed under the MIT License.