import {create} from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if(!newProduct.name || !newProduct.image || !newProduct.price){
            return {success: false, message : "Please fill all the fields."}
        }
        const res = await fetch("/api/products", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(newProduct),
        })
        const data = await res.json();
        set((state) => ({
            products: [...state.products, data.data]//here we use data.data because in controller we are sending data as data: newProduct
        }))
        return {success: true, message: "Product created successfully"}
    },
    fetchProducts : async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data });
    },
    deleteProduct: async (pid) => {

        const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
        }
);
       const data = await res.json();
       if(!data.success) return {success: false, message: data.message}
       set((state) => ({
           products: state.products.filter((product)=> product._id !== pid),//when we click the delete button then it updates the UI 
       }))
        return {success: true, message: data.message};
    },
    updateProduct: async (pid, updatedProduct) => {
        const res = await fetch(`/api/products/${pid}`, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if(!data.success) return {success: false, message: data.message}
        //update the product in the store
        set((state) => ({
            products: state.products.map((product) => product._id === pid ? data.data : product),//here we use data.data because in controller we are sending data as data: updatedProduct
        }))
    }

}));

