System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.8",
    "angular-legacy": "github:angular/bower-angular@1.3.19",
    "angular-mocks": "github:angular/bower-angular-mocks@1.4.8",
    "angular-mocks-legacy": "github:angular/bower-angular-mocks@1.3.19",
    "jquery": "github:components/jquery@2.1.4",
    "github:angular/bower-angular-mocks@1.3.19": {
      "angular": "github:angular/bower-angular@1.4.8"
    },
    "github:angular/bower-angular-mocks@1.4.8": {
      "angular": "github:angular/bower-angular@1.4.8"
    }
  }
});
