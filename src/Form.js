import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import Select from "react-select";
import validator from "email-validator";
import cogoToast from "cogo-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default class Form extends Component {
  state = {
    name: "",
    price: "",
    selectedCategory: null,
    selectedBrand: null,
    selectedSkill: null,
    techAddList: [],
    techList: [],
    userArray: [],
    categoryOptions: [],
    brandOptions: [],
    featuresList: [],
    featureValues: [],
    featuresForm: [],
    productsList: [],
    expandDetails: null,
    expandedData: "",
    expandedDataObject: {},
    productState: "new",
    updatingProdId: null,
    filterOptions: null,
    filterCategory: null,
    searchSuggestions: [],
  };
  componentDidMount() {
    axios
      .get("https://desolate-tor-16337.herokuapp.com/categories")
      .then((res) => {
        var data = res.data;
        var categoryOptions = [];
        data.forEach((element) => {
          categoryOptions.push({
            value: element.category_id,
            label: element.name,
          });
        });
        this.setState({ categoryOptions, filterOptions: categoryOptions });
        console.log(res);
      });
  }
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleFeatureInput = (e) => {
    var featuresForm = this.state.featuresForm;
    featuresForm.forEach((element) => {
      if (element.field === e.target.name) {
        element.value = e.target.value;
      }
    });
    this.setState({ featuresForm });
  };
  handleCategory = (selectedCategory) => {
    this.setState({ selectedCategory }, () => {
      axios
        .get(
          `https://desolate-tor-16337.herokuapp.com/brands/${selectedCategory.value}`
        )
        .then((res) => {
          var data = res.data;
          var brandOptions = [];
          data.forEach((element) => {
            brandOptions.push({
              value: element.brand_id,
              label: element.name,
            });
          });
          this.setState({ brandOptions });
          console.log(res);
        });
      axios
        .get(
          `https://desolate-tor-16337.herokuapp.com/features/${selectedCategory.value}`
        )
        .then((res) => {
          var data = res.data;
          var featuresForm = [];
          data.forEach((element) => {
            featuresForm.push({
              field: element.name,
              value: "",
            });
          });
          this.setState({
            featuresForm,
          });
          console.log(data);
        });
    });
  };
  handleBrand = (selectedBrand) => {
    this.setState({ selectedBrand });
  };
  getProducts = () => {
    axios
      .get("https://desolate-tor-16337.herokuapp.com/products")
      .then((res) => {
        var productsList = [];
        var data = res.data;
        this.setState({ productsList: data });
        console.log(data);
      });
  };
  handleDetails = (i) => {
    if (this.state.expandDetails !== i) {
      var productsList = this.state.productsList;
      axios
        .get(
          `https://desolate-tor-16337.herokuapp.com/details/${productsList[i].product_id}`
        )
        .then((res) => {
          console.log(res);
          var data = res.data;
          // data.forEach(element=>{element.features})
          var expandedDataObject = data[0].features;
          var expandedData = JSON.stringify(data[0].features);
          expandedData = expandedData.replace(/"/g, " ");
          expandedData = expandedData.replace(/{/g, " ");
          expandedData = expandedData.replace(/}/g, " ");
          expandedData = expandedData.replace(/,/g, ", ");

          this.setState({ expandDetails: i, expandedData, expandedDataObject });
        });
    } else {
      this.setState({ expandDetails: null });
    }
  };
  handleSubmit = () => {
    var categoryId = this.state.selectedCategory.value;
    var brandId = this.state.selectedBrand.value;
    var productName = this.state.name;
    var price = this.state.price;
    var newProductId;
    var details = { price: this.state.price };
    this.state.featuresForm.forEach((element) => {
      details[element.field] = element.value;
    });
    if (
      productName.length !== 0 &&
      price.length !== 0 &&
      categoryId.length !== 0 &&
      brandId.length !== 0
    ) {
      if (this.state.productState === "new") {
        axios
          .post(`https://desolate-tor-16337.herokuapp.com/products`, {
            category: categoryId,
            brand: brandId,
            name: productName,
            price: price,
          })
          .then((res) => {
            newProductId = res.data.insertId;
            console.log(res);
            axios
              .post(`https://desolate-tor-16337.herokuapp.com/details`, {
                product: newProductId,
                details: details,
              })
              .then((response) => {
                console.log(response);
                this.setState({
                  name: "",
                  price: "",
                  selectedCategory: null,
                  selectedBrand: null,
                  featuresForm: [],
                });
                cogoToast.success("Product Added Successfully");
              });
          });
      } else {
        axios
          .put(
            `https://desolate-tor-16337.herokuapp.com/products/${this.state.updatingProdId}`,
            {
              category: categoryId,
              brand: brandId,
              name: productName,
              price: price,
            }
          )
          .then((res) => {
            newProductId = this.state.updatingProdId;
            console.log(res);
            axios
              .put(
                `https://desolate-tor-16337.herokuapp.com/details/${this.state.updatingProdId}`,
                {
                  product: newProductId,
                  details: details,
                }
              )
              .then((response) => {
                console.log(response);
                this.setState({
                  name: "",
                  price: "",
                  selectedCategory: null,
                  selectedBrand: null,
                  featuresForm: [],
                  productState: "new",
                });
                cogoToast.success("Product Updated Successfully");
              });
          });
      }
      console.log(details);

      // var userArray = this.state.userArray;
      // userArray.push({
      //   name: name,
      //   email: email,
      //   techArray: techList,
      // });
      // this.setState(
      //   {
      //     userArray,
      //     name: "",
      //     email: "",
      //     techList: [],
      //   },
      //   () => {
      //     cogoToast.success("Data added successfully");
      //   }
      // );
    } else {
      cogoToast.error("All fields are required");
    }
  };
  handleUpdate = async (i) => {
    var name = this.state.productsList[i].name;
    var price = this.state.expandedDataObject.price;
    var categoryId = this.state.productsList[i].category_id;
    var brandId = this.state.productsList[i].brand_id;
    var selectedCategory;
    var selectedBrand;
    var featuresForm = [];
    await axios
      .get(
        `https://desolate-tor-16337.herokuapp.com/names/${categoryId}/${brandId}`
      )
      .then((res) => {
        var data = res.data;
        selectedCategory = { value: categoryId, label: data[0].cName };
        selectedBrand = { value: brandId, label: data[0].bName };
      });

    var keyArray = Object.keys(this.state.expandedDataObject);
    var valArray = Object.values(this.state.expandedDataObject);
    keyArray.forEach((element, index) => {
      if (element !== "price") {
        featuresForm.push({ field: element, value: valArray[index] });
      }
    });

    this.setState(
      {
        name,
        selectedCategory,
        selectedBrand,
        price,
        featuresForm,
        productState: "updating",
        updatingProdId: this.state.productsList[i].product_id,
      },
      () => {
        cogoToast.info("Update the product details above");
      }
    );
  };
  handleDelete = (i) => {
    axios
      .delete(
        `https://desolate-tor-16337.herokuapp.com/delete/${this.state.productsList[i].product_id}`
      )
      .then((res) => {
        console.log(res);
        this.getProducts();
        cogoToast.success("Product deleted successfully");
      });
  };
  handleFilter = (filterCategory) => {
    axios
      .get(
        `https://desolate-tor-16337.herokuapp.com/products?categoryId=${filterCategory.value}`
      )
      .then((res) => {
        var productsList = [];
        var data = res.data;
        this.setState({
          productsList: data,
          filterCategory,
        });
        console.log(data);
      });
  };
  handleSearch = (e) => {
    var search = e.target.value;
    console.log(search);
    if (search.length > 0) {
      axios
        .get(
          `https://desolate-tor-16337.herokuapp.com/products?search=${search}`
        )
        .then((res) => {
          var productsList = [];
          var data = res.data;
          this.setState({
            searchSuggestions: data,
            productsList: data,
            expandDetails: null,
          });
          console.log(data);
        });
    } else {
      this.setState({ searchSuggestions: [] });
    }
  };

  render() {
    return (
      <div>
        <Container fluid className="my-3">
          <Card className="shadow p-3 border-0">
            <Row>
              <Col sm="12" md="6" style={{ height: "webkit-fill-available" }}>
                <Card className="shadow h-100 border-0">
                  <CardHeader style={{ fontSize: "x-large" }}>
                    Enter Product Details
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="12" md="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="category"
                          >
                            Category
                          </label>
                          <Select
                            value={this.state.selectedCategory}
                            onChange={this.handleCategory}
                            options={this.state.categoryOptions}
                            placeholder="Select category of product"
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="12" md="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="brand">
                            Brand
                          </label>
                          <Select
                            value={this.state.selectedBrand}
                            onChange={this.handleBrand}
                            options={this.state.brandOptions}
                            placeholder="Select brand of product"
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="12" md="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="name">
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.name}
                            onChange={this.handleInput}
                            name="name"
                            placeholder="Enter product name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card className="shadow border-0">
                  <CardHeader style={{ fontSize: "x-large" }}>
                    Add Features
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {this.state.featuresForm.map((feature) => (
                        <Col sm="12" md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="feature"
                            >
                              {feature.field}
                            </label>
                            <Input
                              className="form-control-alternative"
                              value={feature.value}
                              onChange={this.handleFeatureInput}
                              name={feature.field}
                              placeholder="Enter feature value"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      ))}
                      <Col sm="12" md="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="price">
                            Price
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={this.state.price}
                            onChange={this.handleInput}
                            name="price"
                            placeholder="Enter product price"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row
              className="mb-3 mt-5"
              style={{ justifyContent: "space-around" }}
            >
              <Col className="col-auto">
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Card>
          <Card className="shadow p-3 border-0">
            <Row>
              <Col md="auto">
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.getProducts}
                >
                  Get Full Product List
                </Button>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    value={this.state.search}
                    onChange={this.handleSearch}
                    name="search"
                    placeholder="Search a product by name"
                    type="text"
                  />
                </FormGroup>
                {this.state.searchSuggestions.map((sug) => (
                  <div
                    className="my-2"
                    onClick={() => {
                      this.setState({
                        productsList: [sug],
                        expandDetails: null,
                      });
                    }}
                  >
                    {sug.name}
                  </div>
                ))}
              </Col>
              <Col md="2">
                {/* <label>filter:</label> */}
                <Select
                  value={this.state.filterCategory}
                  onChange={this.handleFilter}
                  options={this.state.filterOptions}
                  placeholder="Category"
                />
              </Col>
            </Row>
            <Row className="m-3">
              <Col>
                {this.state.productsList.map((product, i) => (
                  <div className="d-flex">
                    <div
                      className="font-weight-bolder"
                      onClick={() => {
                        this.handleDetails(i);
                      }}
                    >
                      {product.name}
                    </div>
                    {this.state.expandDetails === i ? (
                      <div className="ml-5">
                        <div>{this.state.expandedData}</div>
                        <div className="mt-2">
                          <Button
                            color="primary"
                            className="p-1 m-1"
                            onClick={() => {
                              this.handleUpdate(i);
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            color="primary"
                            className="p-1 m-1"
                            onClick={() => {
                              this.handleDelete(i);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    );
  }
}
